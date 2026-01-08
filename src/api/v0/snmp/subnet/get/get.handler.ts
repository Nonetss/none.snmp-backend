import { db } from '@/core/config';
import { subnetTable, deviceTable } from '@/db';
import { eq, sql } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getSubnetRoute } from './get.route';

export const getSubnetHandler: RouteHandler<typeof getSubnetRoute> = async (
  c,
) => {
  const { id } = c.req.valid('param');

  try {
    const [subnet] = await db
      .select({
        id: subnetTable.id,
        cidr: subnetTable.cidr,
        name: subnetTable.name,
        scanPingable: subnetTable.scanPingable,
        deviceCount: sql<number>`cast(count(${deviceTable.id}) as int)`,
      })
      .from(subnetTable)
      .leftJoin(deviceTable, eq(subnetTable.id, deviceTable.subnetId))
      .where(eq(subnetTable.id, id))
      .groupBy(subnetTable.id);

    if (!subnet) {
      return c.json({ message: 'Subnet not found' }, 404) as any;
    }

    return c.json(subnet, 200);
  } catch (error) {
    console.error('Error getting subnet:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
