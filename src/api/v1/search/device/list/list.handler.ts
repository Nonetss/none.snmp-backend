import { db } from '@/core/config';
import { deviceTable, systemTable, interfaceTable } from '@/db';
import { eq, sql } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listDevicesRoute } from './list.route';

export const listDevicesHandler: RouteHandler<typeof listDevicesRoute> = async (
  c,
) => {
  try {
    const results = await db
      .select({
        id: deviceTable.id,
        name: deviceTable.name,
        ipv4: deviceTable.ipv4,
        sysName: systemTable.sysName,
        sysLocation: systemTable.sysLocation,
        sysDescr: systemTable.sysDescr,
        macAddress: sql<string>`(
          SELECT if_phys_address 
          FROM ${interfaceTable} 
          WHERE ${interfaceTable.deviceId} = ${deviceTable.id} 
          AND if_phys_address IS NOT NULL 
          LIMIT 1
        )`,
      })
      .from(deviceTable)
      .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId));

    return c.json(results, 200);
  } catch (error) {
    console.error('[List Devices] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
