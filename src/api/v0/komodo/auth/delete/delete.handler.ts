import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteKomodoAuthRoute } from './delete.route';
import { db } from '@/core/config';
import { komodoAuthTable } from '@/db';
import { eq } from 'drizzle-orm';

export const deleteKomodoAuthHandler: RouteHandler<
  typeof deleteKomodoAuthRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const authId = parseInt(id, 10);

    const result = await db
      .delete(komodoAuthTable)
      .where(eq(komodoAuthTable.id, authId))
      .returning();

    if (result.length === 0) {
      return c.json({ message: 'Credentials not found' }, 404) as any;
    }

    return c.json({ message: 'Komodo credentials deleted' }, 200) as any;
  } catch (error) {
    console.error('[Komodo Auth DELETE] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
