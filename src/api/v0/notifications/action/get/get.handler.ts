import { db } from '@/core/config';
import { notificationActionTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getNotificationActionRoute } from './get.route';

export const getNotificationActionHandler: RouteHandler<
  typeof getNotificationActionRoute
> = async (c) => {
  const { id } = c.req.valid('param');

  try {
    const action = await db.query.notificationActionTable.findFirst({
      where: (fields, { eq }) => eq(fields.id, id),
      with: {
        ntfyAction: true,
      },
    });

    if (!action) {
      return c.json({ message: 'Action not found' }, 404);
    }

    return c.json(action, 200);
  } catch (error) {
    console.error('Error getting notification action:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
