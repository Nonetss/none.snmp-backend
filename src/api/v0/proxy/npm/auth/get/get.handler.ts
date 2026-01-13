import type { RouteHandler } from '@hono/zod-openapi';
import type { getNpmAuthRoute } from './get.route';
import { db } from '@/core/config';
import { npmAuthTable } from '@/db';

export const getNpmAuthHandler: RouteHandler<typeof getNpmAuthRoute> = async (
  c,
) => {
  try {
    const [auth] = await db.select().from(npmAuthTable).limit(1);
    return c.json(auth || null, 200);
  } catch (error) {
    console.error('[NPM Auth GET] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
