import { db } from '@/core/config';
import {
  ntfyActionTable,
  ntfyActionTagTable,
  notificationActionTable,
  ntfyTopicTable,
} from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postNtfyActionRoute } from '@/api/v0/notifications/action/ntfy/post/post.route';

export const postNtfyActionHandler: RouteHandler<
  typeof postNtfyActionRoute
> = async (c) => {
  const { notificationActionId, ntfyTopicId, title, priority, tags } =
    c.req.valid('json');

  try {
    // 1. Verificar que la acción de notificación existe
    const [notificationAction] = await db
      .select()
      .from(notificationActionTable)
      .where(eq(notificationActionTable.id, notificationActionId));

    if (!notificationAction) {
      return c.json(
        {
          message: `Notification action with ID ${notificationActionId} not found`,
        },
        404,
      );
    }

    // 2. Verificar que el tópico de ntfy existe si se proporciona
    if (ntfyTopicId) {
      const [topic] = await db
        .select()
        .from(ntfyTopicTable)
        .where(eq(ntfyTopicTable.id, ntfyTopicId));

      if (!topic) {
        return c.json(
          { message: `Ntfy topic with ID ${ntfyTopicId} not found` },
          404,
        );
      }
    }

    const [action] = await db
      .insert(ntfyActionTable)
      .values({
        notificationActionId,
        ntfyTopicId,
        title,
        priority,
      })
      .returning();

    if (tags && tags.length > 0) {
      await db.insert(ntfyActionTagTable).values(
        tags.map((tag) => ({
          ntfyActionId: action.id,
          tag,
        })),
      );
    }

    return c.json(action, 201);
  } catch (error) {
    console.error('Error configuring ntfy action:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
