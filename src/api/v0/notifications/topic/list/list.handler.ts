import { db } from '@/core/config';
import { ntfyTopicTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listNtfyTopicRoute } from '@/api/v0/notifications/topic/list/list.route';

export const listNtfyTopicHandler: RouteHandler<
  typeof listNtfyTopicRoute
> = async (c) => {
  try {
    const topics = await db.select().from(ntfyTopicTable);
    return c.json(topics, 200);
  } catch (error) {
    console.error('Error listing ntfy topics:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
