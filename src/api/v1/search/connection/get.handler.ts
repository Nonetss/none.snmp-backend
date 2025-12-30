import { db } from '@/core/config';
import {
  bridgeFdbTable,
  bridgePortTable,
  deviceTable,
  interfaceTable,
  ipNetToMediaTable,
  systemTable,
} from '@/db';
import { eq, and, inArray } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getConnectionSearchRoute } from './get.route';

export const getConnectionSearchHandler: RouteHandler<
  typeof getConnectionSearchRoute
> = async (c) => {
  const { query } = c.req.valid('query');

  try {
    let targetMacs: string[] = [query.toUpperCase()];
    const ipMap = new Map<string, string>(); // MAC -> IP

    // 1. Si el query parece una IP, buscamos su MAC en las tablas ARP
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(query)) {
      const arpEntries = await db
        .select()
        .from(ipNetToMediaTable)
        .where(eq(ipNetToMediaTable.ipNetToMediaNetAddress, query));

      if (arpEntries.length > 0) {
        targetMacs = arpEntries.map((e) => e.ipNetToMediaPhysAddress);
        arpEntries.forEach((e) => ipMap.set(e.ipNetToMediaPhysAddress, query));
      } else {
        targetMacs = [];
      }
    }

    if (targetMacs.length === 0) {
      return c.json([], 200);
    }

    // 2. Buscar en la tabla FDB y unir con System e Interface
    const results = await db
      .select({
        switchId: deviceTable.id,
        switchName: systemTable.sysName,
        switchIp: deviceTable.ipv4,
        switchLocation: systemTable.sysLocation,
        switchDescription: systemTable.sysDescr,
        bridgePort: bridgeFdbTable.port,
        // Datos de la interfaz
        interfaceId: interfaceTable.id,
        ifIndex: interfaceTable.ifIndex,
        ifName: interfaceTable.ifName,
        ifDescr: interfaceTable.ifDescr,
        ifType: interfaceTable.ifType,
        ifMtu: interfaceTable.ifMtu,
        ifSpeed: interfaceTable.ifSpeed,
        ifPhysAddress: interfaceTable.ifPhysAddress,
        // Datos del FDB
        macAddress: bridgeFdbTable.address,
        status: bridgeFdbTable.status,
        lastSeen: bridgeFdbTable.updatedAt,
      })
      .from(bridgeFdbTable)
      .innerJoin(deviceTable, eq(bridgeFdbTable.deviceId, deviceTable.id))
      .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId))
      // Mapear el puerto del bridge al ifIndex físico
      .leftJoin(
        bridgePortTable,
        and(
          eq(bridgePortTable.deviceId, bridgeFdbTable.deviceId),
          eq(bridgePortTable.bridgePort, bridgeFdbTable.port),
        ),
      )
      // Obtener detalles de la interfaz física conectada
      .leftJoin(
        interfaceTable,
        and(
          eq(interfaceTable.deviceId, bridgeFdbTable.deviceId),
          eq(interfaceTable.ifIndex, bridgePortTable.ifIndex),
        ),
      )
      .where(inArray(bridgeFdbTable.address, targetMacs));

    return c.json(
      results.map((r) => ({
        switchId: r.switchId,
        switchName: r.switchName,
        switchIp: r.switchIp,
        switchLocation: r.switchLocation,
        switchDescription: r.switchDescription,
        bridgePort: r.bridgePort,
        interface: r.interfaceId
          ? {
              id: r.interfaceId,
              ifIndex: r.ifIndex!,
              ifName: r.ifName,
              ifDescr: r.ifDescr,
              ifType: r.ifType,
              ifMtu: r.ifMtu,
              ifSpeed: r.ifSpeed ? String(r.ifSpeed) : null,
              ifPhysAddress: r.ifPhysAddress,
            }
          : null,
        macAddress: r.macAddress,
        ipAddress: ipMap.get(r.macAddress) || null,
        status: r.status,
        lastSeen: r.lastSeen
          ? r.lastSeen.toISOString()
          : new Date().toISOString(),
      })),
      200,
    );
  } catch (error) {
    console.error(`[Connection Search] Error searching for ${query}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
