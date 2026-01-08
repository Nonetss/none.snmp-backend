import { db } from '@/core/config';
import { monitorRuleTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postMonitorRuleRoute } from './post.route';
import { CronExpressionParser as parser } from 'cron-parser';

export const postMonitorRuleHandler: RouteHandler<
  typeof postMonitorRuleRoute
> = async (c) => {
  try {
    const data = c.req.valid('json');

    // Validar y calcular nextRun
    try {
      const interval = parser.parse(data.cronExpression);
      (data as any).nextRun = interval.next().toDate();
    } catch (e) {
      return c.json({ message: 'Invalid cron expression' }, 400) as any;
    }

    const [newRule] = await db
      .insert(monitorRuleTable)
      .values(data as any)
      .returning();

    return c.json(
      {
        ...newRule,
        lastRun: newRule.lastRun ? newRule.lastRun.toISOString() : null,
        nextRun: newRule.nextRun ? newRule.nextRun.toISOString() : null,
      },
      201,
    );
  } catch (error) {
    console.error('[Post Monitor Rule] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
