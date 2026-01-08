import { db } from '@/core/config';
import { tagTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listTagRoute } from './list.route';

export const listTagHandler: RouteHandler<typeof listTagRoute> = async (c) => {
  try {
    const tags = await db.select().from(tagTable);
    return c.json(tags, 200);
  } catch (error) {
    console.error('[List Tag] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
