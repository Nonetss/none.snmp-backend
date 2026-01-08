import { db } from '@/core/config';
import { notificationActionTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postNotificationActionRoute } from './post.route';

export const postNotificationActionHandler: RouteHandler<
  typeof postNotificationActionRoute
> = async (c) => {
  const values = c.req.valid('json');

  try {
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
