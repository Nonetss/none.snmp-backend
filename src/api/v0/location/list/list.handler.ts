import { db } from '@/core/config';
import { locationTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listLocationRoute } from './list.route';

export const listLocationHandler: RouteHandler<
  typeof listLocationRoute
> = async (c) => {
  try {
    const locations = await db.select().from(locationTable);
    return c.json(locations, 200);
  } catch (error) {
    console.error('[List Location] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
