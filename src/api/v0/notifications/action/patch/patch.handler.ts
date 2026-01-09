import { db } from '@/core/config';
import { notificationActionTable, monitorRuleTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchNotificationActionRoute } from './patch.route';

export const patchNotificationActionHandler: RouteHandler<
  typeof patchNotificationActionRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const values = c.req.valid('json');

  try {
    // 1. Verificar si se está intentando cambiar a una regla que no existe
    if (values.monitorRuleId) {
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
    }

    const [updatedAction] = await db
      .update(notificationActionTable)
      .set(values)
      .where(eq(notificationActionTable.id, id))
      .returning();

    if (!updatedAction) {
      return c.json({ message: 'Action not found' }, 404);
    }

    return c.json(updatedAction, 200);
  } catch (error) {
    console.error('Error updating notification action:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
