import { db } from '@/core/config';
import { taskScheduleTable } from '@/db';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listTaskScheduleRoute } from './list.route';

export const listTaskScheduleHandler: RouteHandler<
  typeof listTaskScheduleRoute
> = async (c) => {
  try {
    const tasks = await db.select().from(taskScheduleTable);
    return c.json(
      tasks.map((t) => ({
        ...t,
        lastRun: t.lastRun?.toISOString() || null,
        nextRun: t.nextRun?.toISOString() || null,
        status: t.status as any,
      })),
      200,
    );
  } catch (error) {
    console.error('Error listing tasks:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
