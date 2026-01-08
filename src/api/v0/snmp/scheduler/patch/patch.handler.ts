import { db } from '@/core/config';
import { taskScheduleTable } from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchTaskScheduleRoute } from './patch.route';
import { CronExpressionParser as parser } from 'cron-parser';

export const patchTaskScheduleHandler: RouteHandler<
  typeof patchTaskScheduleRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const updates = c.req.valid('json');

  try {
    let nextRun = undefined;
    if (updates.cronExpression) {
      try {
        const interval = parser.parse(updates.cronExpression);
        nextRun = interval.next().toDate();
      } catch (e: any) {
        console.error(
          `[Scheduler] Cron parse error (patch): ${e.message} for expression: "${updates.cronExpression}"`,
        );
        return c.json(
          { message: 'Invalid cron expression', error: e.message },
          400,
        ) as any;
      }
    }

    const [updatedTask] = await db
      .update(taskScheduleTable)
      .set({
        ...updates,
        ...(nextRun ? { nextRun } : {}),
      })
      .where(eq(taskScheduleTable.id, id))
      .returning();

    if (!updatedTask) {
      return c.json({ message: 'Task not found' }, 404) as any;
    }

    return c.json(
      {
        ...updatedTask,
        lastRun: updatedTask.lastRun?.toISOString() || null,
        nextRun: updatedTask.nextRun?.toISOString() || null,
        status: updatedTask.status as any,
      },
      200,
    );
  } catch (error) {
    console.error('Error updating task:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
