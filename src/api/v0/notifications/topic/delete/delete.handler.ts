import { db } from '@/core/config';
import { ntfyTopicTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteNtfyTopicRoute } from '@/api/v0/notifications/topic/delete/delete.route';

export const deleteNtfyTopicHandler: RouteHandler<
  typeof deleteNtfyTopicRoute
> = async (c) => {
  const { id } = c.req.valid('param');

  try {
    const [deleted] = await db
      .delete(ntfyTopicTable)
      .where(eq(ntfyTopicTable.id, id))
      .returning();
    if (!deleted) {
      return c.json({ message: 'Topic not found' }, 404) as any;
    }
    return c.json({ message: 'Topic deleted' }, 200);
  } catch (error) {
    console.error('Error deleting ntfy topic:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
