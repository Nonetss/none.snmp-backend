import type { RouteHandler } from '@hono/zod-openapi';
import type { getKomodoAuthRoute } from './get.route';
import { db } from '@/core/config';
import { komodoAuthTable } from '@/db';

export const getKomodoAuthHandler: RouteHandler<
  typeof getKomodoAuthRoute
> = async (c) => {
  try {
    const [auth] = await db.select().from(komodoAuthTable).limit(1);
    return c.json(auth || null, 200);
  } catch (error) {
    console.error('[Komodo Auth GET] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
