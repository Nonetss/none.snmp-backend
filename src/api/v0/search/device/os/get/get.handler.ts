import { db } from '@/core/config';
import { deviceTable, systemTable } from '@/db';
import { eq, ilike } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getDeviceByOsRoute } from './get.route';

export const getDeviceByOsHandler: RouteHandler<
  typeof getDeviceByOsRoute
> = async (c) => {
  const { q } = c.req.valid('query');

  try {
    const results = await db
      .select({
        id: deviceTable.id,
        ipv4: deviceTable.ipv4,
        name: deviceTable.name,
        subnetId: deviceTable.subnetId,
        snmpId: deviceTable.snmpAuthId,
        sysDescr: systemTable.sysDescr,
      })
      .from(deviceTable)
      .innerJoin(systemTable, eq(deviceTable.id, systemTable.deviceId))
      .where(ilike(systemTable.sysDescr, `%${q}%`));

    return c.json(results, 200);
  } catch (error) {
    console.error(`[OS Search] Error searching for ${q}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
