import { db } from '@/core/config';
import { ntfyTopicTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getNtfyTopicRoute } from '@/api/v0/notifications/topic/get/get.route';

export const getNtfyTopicHandler: RouteHandler<
  typeof getNtfyTopicRoute
> = async (c) => {
  const { id } = c.req.valid('param');

  try {
    const [topic] = await db
      .select()
      .from(ntfyTopicTable)
      .where(eq(ntfyTopicTable.id, id));
    if (!topic) {
      return c.json({ message: 'Topic not found' }, 404) as any;
    }
    return c.json(topic, 200);
  } catch (error) {
    console.error('Error getting ntfy topic:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
