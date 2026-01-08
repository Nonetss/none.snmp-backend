import { db } from '@/core/config';
import { monitorGroupTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listMonitorGroupsRoute } from './list.route';

export const listMonitorGroupsHandler: RouteHandler<
  typeof listMonitorGroupsRoute
> = async (c) => {
  try {
    const groups = await db.select().from(monitorGroupTable);
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
