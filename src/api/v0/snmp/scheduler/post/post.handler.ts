import { db } from '@/core/config';
import { taskScheduleTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postTaskScheduleRoute } from './post.route';
import { CronExpressionParser as parser } from 'cron-parser';
import { logger } from '@/lib/logger';

export const postTaskScheduleHandler: RouteHandler<
  typeof postTaskScheduleRoute
> = async (c) => {
  const data = c.req.valid('json');

  try {
    // Validate cron expression
    try {
      const interval = parser.parse(data.cronExpression);
      const nextRun = interval.next().toDate();
      (data as any).nextRun = nextRun;
    } catch (e) {
      logger.error(
        { error: e, cronExpression: data.cronExpression },
        'Invalid cron expression',
      );
      return c.json({ message: 'Invalid cron expression' }, 400) as any;
    }

    const [inserted] = await db
      .insert(taskScheduleTable)
      .values(data as any)
      .returning();

    return c.json(
      {
        id: inserted.id,
        message: 'Task created successfully',
      },
      200,
    );
  } catch (error) {
    logger.error({ error }, 'Error creating task');
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
