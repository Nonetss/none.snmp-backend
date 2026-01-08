import { db } from '@/core/config';
import { ntfyActionTable, ntfyActionTagTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postNtfyActionRoute } from './post.route';

export const postNtfyActionHandler: RouteHandler<
  typeof postNtfyActionRoute
> = async (c) => {
  const { notificationActionId, ntfyTopicId, title, priority, tags } =
    c.req.valid('json');

  try {
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
