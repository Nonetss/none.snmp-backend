import { db } from '@/core/config';
import {
  ipNetToMediaTable,
  ipSnmpTable,
  deviceTable,
  interfaceTable,
} from '@/db';
import { eq, or, and } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getConnectionSearchRoute } from './get.route';

export const getConnectionSearchHandler: RouteHandler<
  typeof getConnectionSearchRoute
> = async (c) => {
  const { query } = c.req.valid('query');

  try {
    // Normalizar MAC si es el caso (opcional, aquí buscamos exacto o por IP)
    const results = await db
      .select({
        deviceId: deviceTable.id,
        deviceName: deviceTable.name,
        deviceIp: deviceTable.ipv4,
        ifIndex: ipNetToMediaTable.ipNetToMediaIfIndex,
        ifName: interfaceTable.ifName,
        ifDescr: interfaceTable.ifDescr,
        macAddress: ipNetToMediaTable.ipNetToMediaPhysAddress,
        ipAddress: ipNetToMediaTable.ipNetToMediaNetAddress,
        type: ipNetToMediaTable.ipNetToMediaType,
        lastSeen: ipNetToMediaTable.time,
      })
      .from(ipNetToMediaTable)
      .innerJoin(ipSnmpTable, eq(ipNetToMediaTable.ipSnmpId, ipSnmpTable.id))
      .innerJoin(deviceTable, eq(ipSnmpTable.deviceId, deviceTable.id))
      .leftJoin(
        interfaceTable,
        and(
          eq(interfaceTable.deviceId, deviceTable.id),
          eq(interfaceTable.ifIndex, ipNetToMediaTable.ipNetToMediaIfIndex),
        ),
      )
      .where(
        or(
          eq(ipNetToMediaTable.ipNetToMediaNetAddress, query),
          eq(ipNetToMediaTable.ipNetToMediaPhysAddress, query.toUpperCase()),
        ),
      );

    return c.json(
      results.map((r) => ({
        ...r,
        lastSeen: r.lastSeen.toISOString(),
      })),
      200,
    );
  } catch (error) {
    console.error(`[Connection Search] Error searching for ${query}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
