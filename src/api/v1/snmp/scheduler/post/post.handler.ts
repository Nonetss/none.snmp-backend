import { db } from '@/core/config';
import { taskScheduleTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postTaskScheduleRoute } from './post.route';
import { CronExpressionParser as parser } from 'cron-parser';

export const postTaskScheduleHandler: RouteHandler<
  typeof postTaskScheduleRoute
> = async (c) => {
  const data = c.req.valid('json');

  try {
    let nextRun = null;
    try {
      const interval = parser.parse(data.cronExpression);
      nextRun = interval.next().toDate();
    } catch (e: any) {
      console.error(
        `[Scheduler] Cron parse error: ${e.message} for expression: "${data.cronExpression}"`,
      );
      return c.json(
        { message: 'Invalid cron expression', error: e.message },
        400,
      ) as any;
    }

    const [newTask] = await db
      .insert(taskScheduleTable)
      .values({
        ...data,
        nextRun,
      })
      .returning();

    return c.json(
      {
        ...newTask,
        lastRun: newTask.lastRun?.toISOString() || null,
        nextRun: newTask.nextRun?.toISOString() || null,
        status: newTask.status as any,
      },
      201,
    );
  } catch (error) {
    console.error('Error creating task:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
