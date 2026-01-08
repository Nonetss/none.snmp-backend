import { db } from '@/core/config';
import { taskScheduleTable } from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteTaskScheduleRoute } from './delete.route';

export const deleteTaskScheduleHandler: RouteHandler<
  typeof deleteTaskScheduleRoute
> = async (c) => {
  const { id } = c.req.valid('param');

  try {
    const [deleted] = await db
      .delete(taskScheduleTable)
      .where(eq(taskScheduleTable.id, id))
      .returning();

    if (!deleted) {
      return c.json({ message: 'Task not found' }, 404) as any;
    }

    return c.json({ message: 'Task deleted' }, 200);
  } catch (error) {
    console.error('Error deleting task:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
