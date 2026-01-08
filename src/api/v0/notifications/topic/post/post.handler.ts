import { db } from '@/core/config';
import { ntfyTopicTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postNtfyTopicRoute } from '@/api/v0/notifications/topic/post/post.route';

export const postNtfyTopicHandler: RouteHandler<
  typeof postNtfyTopicRoute
> = async (c) => {
  const values = c.req.valid('json');

  try {
    const [newTopic] = await db
      .insert(ntfyTopicTable)
      .values(values)
      .returning();
    return c.json(newTopic, 201);
  } catch (error) {
    console.error('Error creating ntfy topic:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
