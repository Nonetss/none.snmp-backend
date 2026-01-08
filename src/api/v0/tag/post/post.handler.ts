import { db } from '@/core/config';
import { tagTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postTagRoute } from './post.route';

export const postTagHandler: RouteHandler<typeof postTagRoute> = async (c) => {
  try {
    const data = c.req.valid('json');
    const [newTag] = await db.insert(tagTable).values(data).returning();
    return c.json(newTag, 201);
  } catch (error) {
    console.error('[Post Tag] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
