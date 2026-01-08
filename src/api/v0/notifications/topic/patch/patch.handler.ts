import { db } from '@/core/config';
import { ntfyTopicTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchNtfyTopicRoute } from '@/api/v0/notifications/topic/patch/patch.route';

export const patchNtfyTopicHandler: RouteHandler<
  typeof patchNtfyTopicRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const updates = c.req.valid('json');

  try {
    const [updated] = await db
      .update(ntfyTopicTable)
      .set(updates)
      .where(eq(ntfyTopicTable.id, id))
      .returning();
    if (!updated) {
      return c.json({ message: 'Topic not found' }, 404) as any;
    }
    return c.json(updated, 200);
  } catch (error) {
    console.error('Error updating ntfy topic:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
