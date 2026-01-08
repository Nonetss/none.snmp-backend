import { db } from '@/core/config';
import { monitorRuleTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postMonitorRuleRoute } from './post.route';

export const postMonitorRuleHandler: RouteHandler<
  typeof postMonitorRuleRoute
> = async (c) => {
  try {
    const data = c.req.valid('json');
    const [newRule] = await db
      .insert(monitorRuleTable)
      .values(data)
      .returning();
    return c.json(newRule, 201);
  } catch (error) {
    console.error('[Post Monitor Rule] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
