import { db } from '@/core/config';
import { monitorRuleTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteMonitorRuleRoute } from './delete.route';

export const deleteMonitorRuleHandler: RouteHandler<
  typeof deleteMonitorRuleRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const ruleId = parseInt(id, 10);

    const [deleted] = await db
      .delete(monitorRuleTable)
      .where(eq(monitorRuleTable.id, ruleId))
      .returning();

    if (!deleted) {
      return c.json({ message: 'Rule not found' }, 404) as any;
    }

    return c.json({ message: 'Rule deleted' }, 200);
  } catch (error) {
    console.error('[Delete Monitor Rule] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
