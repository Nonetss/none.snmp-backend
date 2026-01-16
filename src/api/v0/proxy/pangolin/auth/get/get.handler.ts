import type { RouteHandler } from '@hono/zod-openapi';
import type { getPangolinAuthRoute } from './get.route';
import { db } from '@/core/config';
import { pangolinAuthTable } from '@/db';

export const getPangolinAuthHandler: RouteHandler<
  typeof getPangolinAuthRoute
> = async (c) => {
  try {
    const auth = await db.query.pangolinAuthTable.findFirst();

    return c.json(auth || null, 200);
  } catch (error) {
    console.error('[Pangolin Auth GET] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
