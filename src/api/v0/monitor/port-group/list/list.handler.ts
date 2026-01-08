import { db } from '@/core/config';
import { monitorPortGroupTable, monitorPortGroupItemTable } from '@/db';
import { eq, sql } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listMonitorPortGroupsRoute } from './list.route';

export const listMonitorPortGroupsHandler: RouteHandler<
  typeof listMonitorPortGroupsRoute
> = async (c) => {
  try {
    const groups = await db
      .select({
        id: monitorPortGroupTable.id,
        name: monitorPortGroupTable.name,
        description: monitorPortGroupTable.description,
        portCount: sql<number>`count(${monitorPortGroupItemTable.id})::int`,
      })
      .from(monitorPortGroupTable)
      .leftJoin(
        monitorPortGroupItemTable,
        eq(monitorPortGroupTable.id, monitorPortGroupItemTable.portGroupId),
      )
      .groupBy(monitorPortGroupTable.id);

    return c.json(groups, 200);
  } catch (error) {
    console.error('[List Monitor Port Groups] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
