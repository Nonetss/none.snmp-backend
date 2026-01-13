import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteNpmAuthRoute } from './delete.route';
import { db } from '@/core/config';
import { npmAuthTable } from '@/db';

export const deleteNpmAuthHandler: RouteHandler<
  typeof deleteNpmAuthRoute
> = async (c) => {
  try {
    await db.delete(npmAuthTable);
    return c.json({ message: 'NPM credentials deleted' }, 200) as any;
  } catch (error) {
    console.error('[NPM Auth DELETE] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
