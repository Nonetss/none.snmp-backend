import { db } from '@/core/config';
import { monitorPortGroupTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listMonitorPortGroupsRoute } from './list.route';

export const listMonitorPortGroupsHandler: RouteHandler<
  typeof listMonitorPortGroupsRoute
> = async (c) => {
  try {
    const groups = await db.select().from(monitorPortGroupTable);
    return c.json(groups, 200);
  } catch (error) {
    console.error('[List Monitor Port Groups] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
