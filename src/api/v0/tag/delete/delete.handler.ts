import { db } from '@/core/config';
import { tagTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteTagRoute } from './delete.route';

export const deleteTagHandler: RouteHandler<typeof deleteTagRoute> = async (
  c,
) => {
  try {
    const { id } = c.req.valid('param');

    const [deletedTag] = await db
      .delete(tagTable)
      .where(eq(tagTable.id, parseInt(id, 10)))
      .returning();

    if (!deletedTag) {
      return c.json({ message: 'Tag not found' }, 404) as any;
    }

    return c.json({ message: 'Tag deleted' }, 200);
  } catch (error) {
    console.error('[Delete Tag] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
