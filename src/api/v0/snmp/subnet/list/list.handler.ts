import { db } from '@/core/config';
import { subnetTable, deviceTable } from '@/db';
import { eq, sql } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listSubnetRoute } from './list.route';

export const listSubnetHandler: RouteHandler<typeof listSubnetRoute> = async (
  c,
) => {
  try {
    const subnets = await db
      .select({
        id: subnetTable.id,
        cidr: subnetTable.cidr,
        name: subnetTable.name,
        scanPingable: subnetTable.scanPingable,
        deviceCount: sql<number>`cast(count(${deviceTable.id}) as int)`,
      })
      .from(subnetTable)
      .leftJoin(deviceTable, eq(subnetTable.id, deviceTable.subnetId))
      .groupBy(subnetTable.id);

    return c.json(subnets, 200);
  } catch (error) {
    console.error('Error listing subnets:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
