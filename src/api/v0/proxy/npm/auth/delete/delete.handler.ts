import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteNpmAuthRoute } from './delete.route';
import { db } from '@/core/config';
import { npmAuthTable } from '@/db';
import { eq } from 'drizzle-orm';

export const deleteNpmAuthHandler: RouteHandler<
  typeof deleteNpmAuthRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const authId = parseInt(id, 10);

    const result = await db
      .delete(npmAuthTable)
      .where(eq(npmAuthTable.id, authId))
      .returning();

    if (result.length === 0) {
      return c.json({ message: 'Credentials not found' }, 404) as any;
    }

    return c.json({ message: 'NPM credentials deleted' }, 200) as any;
  } catch (error) {
    console.error('[NPM Auth DELETE] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
