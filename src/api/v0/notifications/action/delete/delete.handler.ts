import { db } from '@/core/config';
import { notificationActionTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteNotificationActionRoute } from './delete.route';

export const deleteNotificationActionHandler: RouteHandler<
  typeof deleteNotificationActionRoute
> = async (c) => {
  const { id } = c.req.valid('param');

  try {
    const [deletedAction] = await db
      .delete(notificationActionTable)
      .where(eq(notificationActionTable.id, id))
      .returning();

    if (!deletedAction) {
      return c.json({ message: 'Action not found' }, 404);
    }

    return c.json({ message: 'Action deleted' }, 200);
  } catch (error) {
    console.error('Error deleting notification action:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
