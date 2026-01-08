import { db } from '@/core/config';
import { monitorRuleTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchMonitorRuleRoute } from './patch.route';

export const patchMonitorRuleHandler: RouteHandler<
  typeof patchMonitorRuleRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const ruleId = parseInt(id, 10);
    const data = c.req.valid('json');

    const [updated] = await db
      .update(monitorRuleTable)
      .set(data)
      .where(eq(monitorRuleTable.id, ruleId))
      .returning();

    if (!updated) {
      return c.json({ message: 'Rule not found' }, 404) as any;
    }

    return c.json(updated, 200);
  } catch (error) {
    console.error('[Patch Monitor Rule] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
