import { db } from '@/core/config';
import { monitorGroupTable, monitorGroupDeviceTable } from '@/db';
import { eq, sql } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listMonitorGroupsRoute } from './list.route';

export const listMonitorGroupsHandler: RouteHandler<
  typeof listMonitorGroupsRoute
> = async (c) => {
  try {
    const groups = await db
      .select({
        id: monitorGroupTable.id,
        name: monitorGroupTable.name,
        description: monitorGroupTable.description,
        createdAt: monitorGroupTable.createdAt,
        deviceCount: sql<number>`count(${monitorGroupDeviceTable.deviceId})::int`,
      })
      .from(monitorGroupTable)
      .leftJoin(
        monitorGroupDeviceTable,
        eq(monitorGroupTable.id, monitorGroupDeviceTable.groupId),
      )
      .groupBy(monitorGroupTable.id);

    return c.json(
      groups.map((g) => ({
        ...g,
        createdAt: g.createdAt.toISOString(),
      })),
      200,
    );
  } catch (error) {
    console.error('[List Monitor Groups] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
