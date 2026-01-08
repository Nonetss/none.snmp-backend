import { db } from '@/core/config';
import { tagTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getTagRoute } from './get.route';

export const getTagHandler: RouteHandler<typeof getTagRoute> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const [tag] = await db
      .select()
      .from(tagTable)
      .where(eq(tagTable.id, parseInt(id, 10)))
      .limit(1);

    if (!tag) {
      return c.json({ message: 'Tag not found' }, 404) as any;
    }

    return c.json(tag, 200);
  } catch (error) {
    console.error('[Get Tag] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
