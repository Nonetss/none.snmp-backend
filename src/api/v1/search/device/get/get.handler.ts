import { db } from '@/core/config';
import {
  deviceTable,
  interfaceTable,
  systemTable,
  ipSnmpTable,
  ipAddrEntryTable,
  ipNetToMediaTable,
  lldpNeighborTable,
  cdpNeighborTable,
  routeTable,
  resourceTable,
  hrSWInstalledEntryTable,
  hrSWRunEntryTable,
  hrSWRunPerfEntryTable,
  bridgeBaseTable,
  bridgePortTable,
  bridgeFdbTable,
  entityPhysicalTable,
} from '@/db';
import { eq, or, inArray } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getDeviceSearchRoute } from './get.route';

export const getDeviceSearchHandler: RouteHandler<
  typeof getDeviceSearchRoute
> = async (c) => {
  const { id, ip, mac } = c.req.valid('query');

  try {
    let deviceIds: number[] = [];

    // 1. Identificar el/los dispositivo(s)
    if (id) {
      deviceIds.push(parseInt(id, 10));
    } else if (ip) {
      const devices = await db
        .select({ id: deviceTable.id })
        .from(deviceTable)
        .where(eq(deviceTable.ipv4, ip));
      deviceIds = devices.map((d) => d.id);
    } else if (mac) {
      const normalizedMac = mac.replace(/[:.-]/g, '').toUpperCase();
      const formattedMac = normalizedMac.match(/.{1,2}/g)?.join(':');

      const interfaces = await db
        .select({ deviceId: interfaceTable.deviceId })
        .from(interfaceTable)
        .where(
          or(
            eq(interfaceTable.ifPhysAddress, formattedMac || ''),
            eq(interfaceTable.ifPhysAddress, mac.toUpperCase()),
          ),
        );
      deviceIds = [...new Set(interfaces.map((i) => i.deviceId))];
    } else {
      return c.json([], 200);
    }

    if (deviceIds.length === 0) return c.json([], 200);

    // Cargar catálogo de dispositivos para resolución de nombres
    const allDevices = await db
      .select({ id: deviceTable.id, name: deviceTable.name })
      .from(deviceTable);
    const deviceMap = new Map(allDevices.map((d) => [d.id, d.name]));

    // 2. Cargar toda la información relacionada
    const results = await Promise.all(
      deviceIds.map(async (deviceId) => {
        const [
          deviceRow,
          systemRow,
          interfaces,
          ipSnmpRows,
          lldpOut,
          cdpOut,
          lldpIn,
          cdpIn,
          routes,
          resources,
          bridgeBaseRow,
          bridgePorts,
          bridgeFdb,
          physicalEntities,
        ] = await Promise.all([
          db.select().from(deviceTable).where(eq(deviceTable.id, deviceId)),
          db
            .select()
            .from(systemTable)
            .where(eq(systemTable.deviceId, deviceId)),
          db
            .select()
            .from(interfaceTable)
            .where(eq(interfaceTable.deviceId, deviceId)),
          db
            .select()
            .from(ipSnmpTable)
            .where(eq(ipSnmpTable.deviceId, deviceId)),
          // Vecinos descubiertos POR este equipo (Salientes)
          db
            .select()
            .from(lldpNeighborTable)
            .where(eq(lldpNeighborTable.deviceId, deviceId)),
          db
            .select()
            .from(cdpNeighborTable)
            .where(eq(cdpNeighborTable.deviceId, deviceId)),
          // Vecinos que VEN a este equipo (Entrantes)
          db
            .select()
            .from(lldpNeighborTable)
            .where(eq(lldpNeighborTable.remoteDeviceId, deviceId)),
          db
            .select()
            .from(cdpNeighborTable)
            .where(eq(cdpNeighborTable.remoteDeviceId, deviceId)),
          db.select().from(routeTable).where(eq(routeTable.deviceId, deviceId)),
          db
            .select()
            .from(resourceTable)
            .where(eq(resourceTable.deviceId, deviceId)),
          db
            .select()
            .from(bridgeBaseTable)
            .where(eq(bridgeBaseTable.deviceId, deviceId)),
          db
            .select()
            .from(bridgePortTable)
            .where(eq(bridgePortTable.deviceId, deviceId)),
          db
            .select()
            .from(bridgeFdbTable)
            .where(eq(bridgeFdbTable.deviceId, deviceId)),
          db
            .select()
            .from(entityPhysicalTable)
            .where(eq(entityPhysicalTable.deviceId, deviceId)),
        ]);

        const device = deviceRow[0];
        if (!device) return null;

        const system = systemRow[0];
        const bridgeBase = bridgeBaseRow[0];
        const ipSnmp = ipSnmpRows[0];

        // Detalles de Red (IPs)
        let ipDetails = null;
        if (ipSnmp) {
          const [addrEntries, netToMediaEntries] = await Promise.all([
            db
              .select()
              .from(ipAddrEntryTable)
              .where(eq(ipAddrEntryTable.ipSnmpId, ipSnmp.id)),
            db
              .select()
              .from(ipNetToMediaTable)
              .where(eq(ipNetToMediaTable.ipSnmpId, ipSnmp.id)),
          ]);
          ipDetails = { addrEntries, netToMediaEntries };
        }

        // Recursos (Software/Procesos)
        const enrichedResources = await Promise.all(
          resources.map(async (res) => {
            const [swInstalled, swRun, swRunPerf] = await Promise.all([
              db
                .select()
                .from(hrSWInstalledEntryTable)
                .where(eq(hrSWInstalledEntryTable.resourceId, res.id)),
              db
                .select()
                .from(hrSWRunEntryTable)
                .where(eq(hrSWRunEntryTable.resourceId, res.id)),
              db
                .select()
                .from(hrSWRunPerfEntryTable)
                .where(eq(hrSWRunPerfEntryTable.resourceId, res.id)),
            ]);
            return { ...res, swInstalled, swRun, swRunPerf };
          }),
        );

        // Consolidar Topología (Vecinos)
        const neighbor_discovery = {
          outbound: [
            ...lldpOut.map((n) => ({
              ...n,
              protocol: 'lldp',
              remoteDeviceName: n.remoteDeviceId
                ? deviceMap.get(n.remoteDeviceId)
                : null,
            })),
            ...cdpOut.map((n) => ({
              ...n,
              protocol: 'cdp',
              remoteDeviceName: n.remoteDeviceId
                ? deviceMap.get(n.remoteDeviceId)
                : null,
            })),
          ],
          inbound: [
            ...lldpIn.map((n) => ({
              ...n,
              protocol: 'lldp',
              remoteDeviceName: deviceMap.get(n.deviceId),
            })),
            ...cdpIn.map((n) => ({
              ...n,
              protocol: 'cdp',
              remoteDeviceName: deviceMap.get(n.deviceId),
            })),
          ],
        };

        return {
          ...device,
          system: system
            ? { ...system, sysUpTime: system.sysUpTime?.toISOString() }
            : null,
          interfaces: interfaces.map((i) => ({
            ...i,
            updatedAt: i.updatedAt?.toISOString(),
          })),
          ipSnmp: ipDetails,
          neighbor_discovery,
          routes: routes.map((r) => ({
            ...r,
            updatedAt: r.updatedAt?.toISOString(),
          })),
          physicalEntities: physicalEntities.map((e) => ({
            ...e,
            updatedAt: e.updatedAt?.toISOString(),
            mfgDate: e.mfgDate?.toISOString(),
          })),
          resources: enrichedResources,
          bridge: {
            base: bridgeBase,
            ports: bridgePorts,
            fdb: bridgeFdb.map((f) => ({
              ...f,
              updatedAt: f.updatedAt?.toISOString(),
            })),
          },
        };
      }),
    );

    return c.json(results.filter(Boolean), 200);
  } catch (error) {
    console.error(`[Search Device Detailed] Error:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
