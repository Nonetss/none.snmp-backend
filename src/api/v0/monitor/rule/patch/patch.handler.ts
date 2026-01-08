import { db } from '@/core/config';
import { monitorRuleTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchMonitorRuleRoute } from './patch.route';
import { CronExpressionParser as parser } from 'cron-parser';

export const patchMonitorRuleHandler: RouteHandler<
  typeof patchMonitorRuleRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const ruleId = parseInt(id, 10);
    const data = c.req.valid('json');

    // Si se actualiza el cron, recalcular nextRun
    if (data.cronExpression) {
      try {
        const interval = parser.parse(data.cronExpression);
        (data as any).nextRun = interval.next().toDate();
      } catch (e) {
        return c.json({ message: 'Invalid cron expression' }, 400) as any;
      }
    }

    const [updated] = await db
      .update(monitorRuleTable)
      .set(data as any)
      .where(eq(monitorRuleTable.id, ruleId))
      .returning();

    if (!updated) {
      return c.json({ message: 'Rule not found' }, 404) as any;
    }

    return c.json(
      {
        ...updated,
        lastRun: updated.lastRun ? updated.lastRun.toISOString() : null,
        nextRun: updated.nextRun ? updated.nextRun.toISOString() : null,
      },
      200,
    );
  } catch (error) {
    console.error('[Patch Monitor Rule] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
