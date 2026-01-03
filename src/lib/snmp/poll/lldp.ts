import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  interfaceTable,
  snmpAuthTable,
  lldpNeighborTable,
} from '@/db';
import { inArray, eq, sql } from 'drizzle-orm';
import { walkSNMP, sanitizeString } from '@/lib/snmp';

const LLDP_METRICS = [
  'lldpRemChassisIdSubtype',
  'lldpRemChassisId',
  'lldpRemPortIdSubtype',
  'lldpRemPortId',
  'lldpRemPortDesc',
  'lldpRemSysName',
  'lldpRemSysDesc',
  'lldpRemSysCapSupported',
  'lldpRemSysCapEnabled',
  'lldpRemManAddrIfSubtype',
] as const;

function formatValue(name: string, value: any): any {
  if (value === null || value === undefined) return null;

  // Subtipos y campos numéricos

  if (
    name.endsWith('Subtype') ||
    name.endsWith('Index') ||
    name.endsWith('Num')
  ) {
    return parseInt(String(value), 10);
  }

  if (Buffer.isBuffer(value)) {
    // 1. Caso binario (6 bytes)

    if (value.length === 6) {
      const isPrintable = value.every((b) => b >= 32 && b <= 126);

      if (!isPrintable) {
        return Array.from(value)

          .map((b) => b.toString(16).padStart(2, '0').toUpperCase())

          .join(':');
      }
    }

    // 2. Caso binario genérico (Bits de capacidades)

    if (name === 'lldpRemSysCapSupported' || name === 'lldpRemSysCapEnabled') {
      return value.toString('hex').toUpperCase();
    }
  }

  const strValue = sanitizeString(value).trim();

  // 3. Normalizar MACs que vienen como String

  if (
    /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(strValue) ||
    /^[0-9A-Fa-f]{12}$/.test(strValue.replace(/[:.-]/g, ''))
  ) {
    const clean = strValue.replace(/[:.-]/g, '').toUpperCase();

    return clean.match(/.{1,2}/g)?.join(':') || clean;
  }

  return strValue.replace(/[^\x20-\x7E]/g, '');
}

/**
 * Extrae la dirección de gestión del índice de SNMP.
 * lldpRemManAddrTable index: [timeMark, localPortNum, neighborIndex, subtype, length, ...address]
 */
function parseMgmtAddress(indexParts: string[]): string | null {
  if (indexParts.length < 5) return null;
  const subtype = parseInt(indexParts[3], 10);
  const len = parseInt(indexParts[4], 10);
  const addrParts = indexParts.slice(5, 5 + len);

  if (subtype === 1 && len === 4) {
    // IPv4
    return addrParts.join('.');
  }
  return null;
}

export async function pollLldp(deviceId?: number) {
  console.time('pollLldp');

  // 1. Obtener definiciones de métricas
  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, Array.from(LLDP_METRICS)));

  if (metrics.length === 0) {
    console.warn('[LLDP Poll] No metrics defined for LLDP-MIB.');
    return;
  }

  // 2. Cache para resolución de topología
  const allDevices = await db.select().from(deviceTable);
  const deviceIpMap = new Map(allDevices.map((d) => [d.ipv4, d.id]));
  // Mapa de Nombre (normalizado) -> deviceId
  const deviceNameMap = new Map(
    allDevices
      .filter((d) => d.name)
      .map((d) => [d.name!.toLowerCase().split('.')[0], d.id]),
  );

  const allInterfaces = await db.select().from(interfaceTable);
  // Mapa de MAC -> deviceId para resolver dispositivos por Chassis ID o Port ID
  const interfaceMacMap = new Map<string, number>();
  // Mapa de deviceId -> [interfaces] para resolver la interfaz remota exacta
  const deviceInterfacesMap = new Map<number, (typeof allInterfaces)[0][]>();

  for (const iface of allInterfaces) {
    if (iface.ifPhysAddress) {
      interfaceMacMap.set(iface.ifPhysAddress.toUpperCase(), iface.deviceId);
    }
    const list = deviceInterfacesMap.get(iface.deviceId) || [];
    list.push(iface);
    deviceInterfacesMap.set(iface.deviceId, list);
  }

  // 3. Obtener dispositivo(s)
  const query = db
    .select({
      id: deviceTable.id,
      ipv4: deviceTable.ipv4,
      snmpAuth: snmpAuthTable,
    })
    .from(deviceTable)
    .innerJoin(snmpAuthTable, eq(deviceTable.snmpAuthId, snmpAuthTable.id));

  if (deviceId) {
    query.where(eq(deviceTable.id, deviceId));
  }

  const devices = await query;
  console.log(`[LLDP Poll] Processing ${devices.length} devices...`);

  const processDevice = async (device: (typeof devices)[0]) => {
    try {
      // Interfaces locales del dispositivo actual para mapear interfaceId
      const currentDeviceInterfaces = deviceInterfacesMap.get(device.id) || [];
      const ifIndexMap = new Map(
        currentDeviceInterfaces.map((i) => [i.ifIndex, i.id]),
      );

      const promises = metrics.map(async (metric) => {
        try {
          const result = await walkSNMP(
            device.ipv4,
            device.snmpAuth,
            metric.oidBase,
            3000,
          );
          return { name: metric.name, result, baseOid: metric.oidBase };
        } catch (error) {
          return { name: metric.name, result: [], baseOid: metric.oidBase };
        }
      });

      const data = await Promise.all(promises);
      const neighborsMap = new Map<string, any>();

      for (const { name, result, baseOid } of data) {
        const baseLen = baseOid.split('.').length;
        for (const varbind of result) {
          const parts = varbind.oid.split('.');
          const indexParts = parts.slice(baseLen);

          if (indexParts.length < 3) continue;

          // localPortNum.neighborIndex
          const indexKey = `${indexParts[1]}.${indexParts[2]}`;

          if (!neighborsMap.has(indexKey)) {
            neighborsMap.set(indexKey, {
              localPortNum: parseInt(indexParts[1], 10),
              neighborIndex: parseInt(indexParts[2], 10),
              mgmtAddress: null,
            });
          }

          const neighbor = neighborsMap.get(indexKey);

          if (name === 'lldpRemManAddrIfSubtype') {
            const ip = parseMgmtAddress(indexParts);
            if (ip) neighbor.mgmtAddress = ip;
          } else {
            neighbor[name] = formatValue(name, varbind.value);
          }
        }
      }

      const neighborEntries = Array.from(neighborsMap.values());

      if (neighborEntries.length > 0) {
        await db
          .insert(lldpNeighborTable)
          .values(
            neighborEntries.map((n) => {
              // --- ESTRATEGIA DE RESOLUCIÓN AGRESIVA ---
              let remoteDeviceId: number | null = null;

              const cleanName = (s: string | null) =>
                s ? s.toLowerCase().split('.')[0] : null;

              // 1. Por IP de Gestión
              if (n.mgmtAddress && deviceIpMap.has(n.mgmtAddress)) {
                remoteDeviceId = deviceIpMap.get(n.mgmtAddress)!;
              }

              // 2. Por MAC de Chasis (Subtype 4)
              if (
                !remoteDeviceId &&
                n.lldpRemChassisIdSubtype === 4 &&
                n.lldpRemChassisId
              ) {
                remoteDeviceId = interfaceMacMap.get(
                  n.lldpRemChassisId.toUpperCase(),
                );
              }

              // 3. Por MAC de Puerto (A veces el puerto anuncia la MAC del equipo)
              if (
                !remoteDeviceId &&
                n.lldpRemPortId &&
                /^[0-9A-F:]{17}$/i.test(n.lldpRemPortId)
              ) {
                remoteDeviceId = interfaceMacMap.get(
                  n.lldpRemPortId.toUpperCase(),
                );
              }

              // 4. Por Nombre de Sistema
              if (!remoteDeviceId) {
                const nameToTry =
                  cleanName(n.lldpRemSysName) || cleanName(n.lldpRemChassisId);
                if (nameToTry && deviceNameMap.has(nameToTry)) {
                  remoteDeviceId = deviceNameMap.get(nameToTry)!;
                }
              }

              // 2. Intentar resolver remoteInterfaceId si tenemos el dispositivo
              let remoteInterfaceId: number | null = null;
              if (remoteDeviceId && n.portId) {
                const remoteIfaces =
                  deviceInterfacesMap.get(remoteDeviceId) || [];
                const pId = n.portId.toUpperCase();

                const found = remoteIfaces.find((i) => {
                  const ifMac = i.ifPhysAddress?.toUpperCase();

                  // Si el portId es una MAC (formateada por formatValue), prioridad absoluta a la MAC
                  if (/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i.test(pId)) {
                    if (ifMac === pId) return true;
                  }

                  // Si no, buscamos por Nombre, Descripción o Índice
                  return (
                    i.ifName?.toUpperCase() === pId ||
                    i.ifDescr?.toUpperCase() === pId ||
                    String(i.ifIndex) === pId
                  );
                });
                if (found) remoteInterfaceId = found.id;
              }

              return {
                deviceId: device.id,
                interfaceId: ifIndexMap.get(n.localPortNum) || null,
                localPortNum: n.localPortNum,
                neighborIndex: n.neighborIndex,
                chassisIdSubtype: n.lldpRemChassisIdSubtype,
                chassisId: n.lldpRemChassisId,
                portIdSubtype: n.lldpRemPortIdSubtype,
                portId: n.lldpRemPortId,
                portDesc: n.lldpRemPortDesc,
                sysName: n.lldpRemSysName,
                sysDesc: n.lldpRemSysDesc,
                sysCapSupported: n.lldpRemSysCapSupported,
                sysCapEnabled: n.lldpRemSysCapEnabled,
                mgmtAddress: n.mgmtAddress,
                remoteDeviceId,
                remoteInterfaceId,
              };
            }),
          )
          .onConflictDoUpdate({
            target: [
              lldpNeighborTable.deviceId,
              lldpNeighborTable.localPortNum,
              lldpNeighborTable.neighborIndex,
            ],
            set: {
              interfaceId: sql`EXCLUDED.interface_id`,
              chassisIdSubtype: sql`EXCLUDED.chassis_id_subtype`,
              chassisId: sql`EXCLUDED.chassis_id`,
              portIdSubtype: sql`EXCLUDED.port_id_subtype`,
              portId: sql`EXCLUDED.port_id`,
              portDesc: sql`EXCLUDED.port_desc`,
              sysName: sql`EXCLUDED.sys_name`,
              sysDesc: sql`EXCLUDED.sys_desc`,
              sysCapSupported: sql`EXCLUDED.sys_cap_supported`,
              sysCapEnabled: sql`EXCLUDED.sys_cap_enabled`,
              mgmtAddress: sql`EXCLUDED.mgmt_address`,
              remoteDeviceId: sql`EXCLUDED.remote_device_id`,
              remoteInterfaceId: sql`EXCLUDED.remote_interface_id`,
              updatedAt: new Date(),
            },
          });
        console.log(
          `[LLDP Poll] ${device.ipv4}: Success (${neighborEntries.length} neighbors)`,
        );
      }
    } catch (error) {
      console.error(`[LLDP Poll] Error ${device.ipv4}:`, error);
    }
  };

  await Promise.all(devices.map(processDevice));
  console.timeEnd('pollLldp');
}
