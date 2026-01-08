import { db } from '@/core/config';
import { locationTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postLocationRoute } from './post.route';

export const postLocationHandler: RouteHandler<
  typeof postLocationRoute
> = async (c) => {
  try {
    const data = c.req.valid('json');
    const [newLocation] = await db
      .insert(locationTable)
      .values(data)
      .returning();

    return c.json(newLocation, 201);
  } catch (error) {
    console.error('[Post Location] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
