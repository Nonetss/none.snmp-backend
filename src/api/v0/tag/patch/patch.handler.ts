import { db } from '@/core/config';
import { tagTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchTagRoute } from './patch.route';

export const patchTagHandler: RouteHandler<typeof patchTagRoute> = async (
  c,
) => {
  try {
    const { id } = c.req.valid('param');
    const data = c.req.valid('json');

    const [updatedTag] = await db
      .update(tagTable)
      .set(data)
      .where(eq(tagTable.id, parseInt(id, 10)))
      .returning();

    if (!updatedTag) {
      return c.json({ message: 'Tag not found' }, 404) as any;
    }

    return c.json(updatedTag, 200);
  } catch (error) {
    console.error('[Patch Tag] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
