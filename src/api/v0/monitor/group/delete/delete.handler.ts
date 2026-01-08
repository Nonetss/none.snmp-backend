import { db } from '@/core/config';
import { monitorGroupTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteMonitorGroupRoute } from './delete.route';

export const deleteMonitorGroupHandler: RouteHandler<
  typeof deleteMonitorGroupRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const groupId = parseInt(id, 10);

    const [deleted] = await db
      .delete(monitorGroupTable)
      .where(eq(monitorGroupTable.id, groupId))
      .returning();

    if (!deleted) {
      return c.json({ message: 'Group not found' }, 404) as any;
    }

    return c.json({ message: 'Group deleted' }, 200);
  } catch (error) {
    console.error('[Delete Monitor Group] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
