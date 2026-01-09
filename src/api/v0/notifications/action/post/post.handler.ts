import { db } from '@/core/config';
import { notificationActionTable, monitorRuleTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postNotificationActionRoute } from '@/api/v0/notifications/action/post/post.route';

export const postNotificationActionHandler: RouteHandler<
  typeof postNotificationActionRoute
> = async (c) => {
  const values = c.req.valid('json');

  try {
    // 1. Verificar si la regla existe
    const [rule] = await db
      .select()
      .from(monitorRuleTable)
      .where(eq(monitorRuleTable.id, values.monitorRuleId));

    if (!rule) {
      return c.json(
        { message: `Monitor rule with ID ${values.monitorRuleId} not found` },
        404,
      );
    }

    const [newAction] = await db
      .insert(notificationActionTable)
      .values(values)
      .returning();
    return c.json(newAction, 201);
  } catch (error) {
    console.error('Error creating notification action:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
