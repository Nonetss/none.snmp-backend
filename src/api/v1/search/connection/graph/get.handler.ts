import {
  deviceTable,
  interfaceTable,
  lldpNeighborTable,
  cdpNeighborTable,
  systemTable,
  routeTable,
  bridgeFdbTable,
  bridgePortTable,
  ipAddrEntryTable,
  ipSnmpTable,
} from '@/db';
import { eq, ne, and, inArray } from 'drizzle-orm';
import { Handler } from 'hono';
import { db } from '@/core/config';

export const getConnectionGraphHandler: Handler = async (c) => {
  // 1. Cargar todos los datos necesarios en paralelo
  const [allLldp, allCdp, allRoutes, allDevices, allInterfaces, allIps] =
    await Promise.all([
      db.select().from(lldpNeighborTable),
      db.select().from(cdpNeighborTable),
      db
        .select()
        .from(routeTable)
        .where(
          and(
            ne(routeTable.nextHop, '0.0.0.0'),
            ne(routeTable.nextHop, '127.0.0.1'),
          ),
        ),
      db
        .select({
          id: deviceTable.id,
          ipv4: deviceTable.ipv4,
          name: deviceTable.name,
          system: systemTable,
        })
        .from(deviceTable)
        .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId)),
      db.select().from(interfaceTable),
      db
        .select({
          deviceId: ipSnmpTable.deviceId,
          ip: ipAddrEntryTable.ipAdEntAddr,
          mask: ipAddrEntryTable.ipAdEntNetMask,
          ifIndex: ipAddrEntryTable.ipAdEntIfIndex,
        })
        .from(ipAddrEntryTable)
        .innerJoin(ipSnmpTable, eq(ipAddrEntryTable.ipSnmpId, ipSnmpTable.id)),
    ]);

  // 2. Construir índices en memoria para cruces ultra-rápidos
  const deviceIdMap = new Map(allDevices.map((d) => [d.id, d]));
  const deviceIpMap = new Map(allDevices.map((d) => [d.ipv4, d]));

  const deviceInterfacesMap = new Map<number, (typeof allInterfaces)[0][]>();
  const macToDeviceMap = new Map<string, number>();
  for (const iface of allInterfaces) {
    const list = deviceInterfacesMap.get(iface.deviceId) || [];
    list.push(iface);
    deviceInterfacesMap.set(iface.deviceId, list);
    if (iface.ifPhysAddress)
      macToDeviceMap.set(iface.ifPhysAddress.toUpperCase(), iface.deviceId);
  }

  const deviceIpsMap = new Map<number, (typeof allIps)[0][]>();
  for (const ipEntry of allIps) {
    const list = deviceIpsMap.get(ipEntry.deviceId) || [];
    list.push(ipEntry);
    deviceIpsMap.set(ipEntry.deviceId, list);
  }

  const nodesMap = new Map();
  const edgesMap = new Map();
  const occupiedPorts = new Set<string>(); // deviceId-ifIndex
  const devicePairConnectedL2 = new Set<string>(); // minId-maxId
  const devicesWithL2 = new Set<number>(); // IDs de dispositivos con conexiones L2 confirmadas

  const cleanName = (s: string | null) =>
    s ? s.toLowerCase().split('.')[0] : null;

  // 3. PROCESAR LLDP (Capa Física Principal)
  for (const n of allLldp) {
    const sourceDev = deviceIdMap.get(n.deviceId)!;
    const sourceIface = (deviceInterfacesMap.get(n.deviceId) || []).find(
      (i) => i.id === n.interfaceId,
    );
    let remoteDev = n.remoteDeviceId ? deviceIdMap.get(n.remoteDeviceId) : null;

    if (!remoteDev) {
      if (
        n.lldpRemChassisId &&
        macToDeviceMap.has(n.lldpRemChassisId.toUpperCase())
      )
        remoteDev = deviceIdMap.get(
          macToDeviceMap.get(n.lldpRemChassisId.toUpperCase())!,
        );
      else if (
        n.lldpRemPortId &&
        macToDeviceMap.has(n.lldpRemPortId.toUpperCase())
      )
        remoteDev = deviceIdMap.get(
          macToDeviceMap.get(n.lldpRemPortId.toUpperCase())!,
        );
      else {
        const nameToTry =
          cleanName(n.lldpRemSysName) || cleanName(n.lldpRemChassisId);
        const match = allDevices.find(
          (d) =>
            cleanName(d.name) === nameToTry ||
            cleanName(d.system?.sysName!) === nameToTry,
        );
        if (match) remoteDev = match;
      }
    }

    addOrUpdateEdge(
      sourceDev,
      sourceIface,
      remoteDev,
      n.lldpRemChassisId,
      n.lldpRemSysName,
      null, // mgmtAddress removed
      n.lldpRemPortId,
      'lldp',
      sourceIface?.ifIndex || 0,
      n.id,
      n.remoteInterfaceId,
    );
  }

  // 4. PROCESAR CDP (Capa Física Complementaria)
  for (const n of allCdp) {
    const sourceDev = deviceIdMap.get(n.deviceId)!;
    const sourceIface = (deviceInterfacesMap.get(n.deviceId) || []).find(
      (i) => i.id === n.interfaceId,
    );
    let remoteDev = n.remoteDeviceId ? deviceIdMap.get(n.remoteDeviceId) : null;

    if (!remoteDev) {
      if (n.cdpCacheAddress && deviceIpMap.has(n.cdpCacheAddress))
        remoteDev = deviceIpMap.get(n.cdpCacheAddress);
      else {
        const nameToTry =
          cleanName(n.cdpCacheSysName) || cleanName(n.cdpCacheDeviceId);
        const match = allDevices.find(
          (d) =>
            cleanName(d.name) === nameToTry ||
            cleanName(d.system?.sysName!) === nameToTry,
        );
        if (match) remoteDev = match;
      }
    }

    addOrUpdateEdge(
      sourceDev,
      sourceIface,
      remoteDev,
      n.cdpCacheDeviceId,
      n.cdpCacheSysName,
      n.cdpCacheAddress,
      n.cdpCacheDevicePort,
      'cdp',
      sourceIface?.ifIndex || 0,
      n.id,
      n.remoteInterfaceId,
      n.cdpCachePlatform,
      n.cdpCacheCapabilities,
    );
  }

  // 5. PROCESAR FDB (Dispositivos finales sin protocolos de descubrimiento)
  const devicesWithoutL2 = allDevices.filter((d) => !devicesWithL2.has(d.id));
  const macsToSearch = devicesWithoutL2.flatMap((d) =>
    (deviceInterfacesMap.get(d.id) || [])
      .map((i) => i.ifPhysAddress?.toUpperCase())
      .filter(Boolean),
  ) as string[];

  if (macsToSearch.length > 0) {
    const fdbEntries = await db
      .select({
        switchId: bridgeFdbTable.deviceId,
        bridgePort: bridgeFdbTable.port,
        macAddress: bridgeFdbTable.address,
        ifIndex: bridgePortTable.ifIndex,
      })
      .from(bridgeFdbTable)
      .leftJoin(
        bridgePortTable,
        and(
          eq(bridgeFdbTable.deviceId, bridgePortTable.deviceId),
          eq(bridgeFdbTable.port, bridgePortTable.bridgePort),
        ),
      )
      .where(inArray(bridgeFdbTable.address, macsToSearch));

    const switchPortCount = new Map<string, number>();
    fdbEntries.forEach((e) => {
      const k = `${e.switchId}:${e.bridgePort}`;
      switchPortCount.set(k, (switchPortCount.get(k) || 0) + 1);
    });

    for (const dev of devicesWithoutL2) {
      const devMacs = (deviceInterfacesMap.get(dev.id) || [])
        .map((i) => i.ifPhysAddress?.toUpperCase())
        .filter(Boolean);
      const potential = fdbEntries.filter(
        (e) =>
          devMacs.includes(e.macAddress.toUpperCase()) &&
          !occupiedPorts.has(`${e.switchId}-${e.ifIndex}`),
      );
      if (potential.length === 0) continue;

      potential.sort(
        (a, b) =>
          (switchPortCount.get(`${a.switchId}:${a.bridgePort}`) || 999) -
          (switchPortCount.get(`${b.switchId}:${b.bridgePort}`) || 999),
      );
      const best = potential[0];
      const sourceDev = deviceIdMap.get(best.switchId)!;
      const sourceIface = (deviceInterfacesMap.get(sourceDev.id) || []).find(
        (i) => i.ifIndex === best.ifIndex,
      );
      addOrUpdateEdge(
        sourceDev,
        sourceIface,
        dev,
        null,
        null,
        null,
        null,
        'fdb',
        best.ifIndex || 0,
        best.ifIndex || 0,
      );
    }
  }

  // 6. PROCESAR RUTAS (Capa Lógica)
  for (const r of allRoutes) {
    const sourceDev = deviceIdMap.get(r.deviceId);
    const remoteDev = deviceIpMap.get(r.nextHop);
    if (sourceDev && remoteDev && sourceDev.id !== remoteDev.id) {
      const pairKey = [sourceDev.id, remoteDev.id]
        .sort((a, b) => a - b)
        .join('-');
      if (!devicePairConnectedL2.has(pairKey)) {
        const sourceIface = (deviceInterfacesMap.get(sourceDev.id) || []).find(
          (i) => i.ifIndex === r.ifIndex,
        );
        addOrUpdateEdge(
          sourceDev,
          sourceIface,
          remoteDev,
          null,
          null,
          r.nextHop,
          null,
          'routing',
          r.ifIndex || 0,
          r.id,
        );
      }
    }
  }

  function addOrUpdateEdge(
    sourceDev: any,
    sourceIface: any,
    remoteDev: any,
    neighborId: any,
    neighborName: any,
    neighborIp: any,
    portId: any,
    protocol: string,
    localIndex: number,
    dbId: number,
    remoteInterfaceId?: number | null,
    neighborPlatform?: string | null,
    neighborCapabilities?: string | null,
  ) {
    const sourceNodeId = `dev-${sourceDev.id}`;
    if (!nodesMap.has(sourceNodeId))
      nodesMap.set(sourceNodeId, buildEnrichedNode(sourceDev));

    let targetNodeId, targetLabel;
    if (remoteDev) {
      targetNodeId = `dev-${remoteDev.id}`;
      targetLabel =
        remoteDev.name || remoteDev.system?.sysName || remoteDev.ipv4;
      if (!nodesMap.has(targetNodeId))
        nodesMap.set(targetNodeId, buildEnrichedNode(remoteDev));
      const pairKey = [sourceDev.id, remoteDev.id]
        .sort((a, b) => a - b)
        .join('-');
      devicePairConnectedL2.add(pairKey);
      devicesWithL2.add(sourceDev.id);
      devicesWithL2.add(remoteDev.id);
    } else {
      targetNodeId = `ext-${neighborId || neighborName || neighborIp || localIndex}`;
      targetLabel = neighborName || neighborId || 'External Device';
      const existingNode = nodesMap.get(targetNodeId);
      if (!existingNode) {
        nodesMap.set(targetNodeId, {
          id: targetNodeId,
          label: targetLabel,
          type: 'unmanaged',
          mgmtAddress: neighborIp,
          platform: neighborPlatform,
          capabilities: neighborCapabilities,
        });
      } else if (existingNode.type === 'unmanaged') {
        // Actualizar info si ahora tenemos más datos (ej: de CDP después de LLDP)
        if (!existingNode.mgmtAddress && neighborIp)
          existingNode.mgmtAddress = neighborIp;
        if (!existingNode.platform && neighborPlatform)
          existingNode.platform = neighborPlatform;
        if (!existingNode.capabilities && neighborCapabilities)
          existingNode.capabilities = neighborCapabilities;
      }
    }

    const edgeKey = `${sourceNodeId}-${targetNodeId}-${localIndex}`;
    const existing = edgesMap.get(edgeKey);

    if (existing) {
      if (!existing.metadata.protocol.includes(protocol))
        existing.metadata.protocol += `, ${protocol}`;
      // Enriquecer metadata existente
      if (!existing.metadata.platform && neighborPlatform)
        existing.metadata.platform = neighborPlatform;
      if (!existing.metadata.capabilities && neighborCapabilities)
        existing.metadata.capabilities = neighborCapabilities;
      return;
    }

    // Enriquecer metadata de interfaces para el Edge
    const sourceInterfaceInfo = sourceIface
      ? {
          ifIndex: sourceIface.ifIndex,
          ifName: sourceIface.ifName,
          ifDescr: sourceIface.ifDescr,
          ifType: sourceIface.ifType,
          mac: sourceIface.ifPhysAddress,
          speed: sourceIface.ifSpeed,
        }
      : { ifIndex: localIndex, label: `Port ${localIndex}` };

    let targetInterfaceInfo: any = { label: portId || 'Unknown' };
    if (remoteDev) {
      let found = null;
      if (remoteInterfaceId) {
        found = (deviceInterfacesMap.get(remoteDev.id) || []).find(
          (i) => i.id === remoteInterfaceId,
        );
      }

      if (!found && portId) {
        found = (deviceInterfacesMap.get(remoteDev.id) || []).find(
          (i) =>
            i.ifPhysAddress?.toUpperCase() === portId.toUpperCase() ||
            i.ifName?.toUpperCase() === portId.toUpperCase() ||
            String(i.ifIndex) === portId,
        );
      }

      if (found) {
        targetInterfaceInfo = {
          ifIndex: found.ifIndex,
          ifName: found.ifName,
          ifDescr: found.ifDescr,
          ifType: found.ifType,
          mac: found.ifPhysAddress,
          speed: found.ifSpeed,
        };
      }
    }

    edgesMap.set(edgeKey, {
      id: `edge-${protocol}-${dbId}`,
      source: sourceNodeId,
      target: targetNodeId,
      metadata: {
        protocol,
        sysName: targetLabel,
        sourceInterface: sourceInterfaceInfo,
        targetInterface: targetInterfaceInfo,
        platform: neighborPlatform,
        capabilities: neighborCapabilities,
      },
    });
    occupiedPorts.add(`${sourceDev.id}-${localIndex}`);
  }

  function buildEnrichedNode(dev: any) {
    const ifaces = deviceInterfacesMap.get(dev.id) || [];
    const ips = deviceIpsMap.get(dev.id) || [];
    return {
      id: `dev-${dev.id}`,
      label: dev.name || dev.system?.sysName || dev.ipv4,
      ip: dev.ipv4,
      type: 'managed',
      details: {
        id: dev.id,
        name: dev.name,
        ipv4: dev.ipv4,
        system: dev.system
          ? {
              sysName: dev.system.sysName,
              sysDescr: dev.system.sysDescr,
              sysLocation: dev.system.sysLocation,
              sysContact: dev.system.sysContact,
            }
          : null,
        interfaces: ifaces.map((i) => ({
          ifIndex: i.ifIndex,
          ifName: i.ifName,
          ifDescr: i.ifDescr,
          ifType: i.ifType,
          mac: i.ifPhysAddress,
          speed: i.ifSpeed,
        })),
        ips: ips.map((ip) => ({
          address: ip.ip,
          mask: ip.mask,
          ifIndex: ip.ifIndex,
        })),
      },
    };
  }

  return c.json({
    nodes: Array.from(nodesMap.values()),
    edges: Array.from(edgesMap.values()),
  });
};
