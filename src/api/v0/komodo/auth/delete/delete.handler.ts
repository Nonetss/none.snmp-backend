import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteKomodoAuthRoute } from './delete.route';
import { db } from '@/core/config';
import { komodoAuthTable } from '@/db';

export const deleteKomodoAuthHandler: RouteHandler<
  typeof deleteKomodoAuthRoute
> = async (c) => {
  try {
    await db.delete(komodoAuthTable);
    return c.json({ message: 'Komodo credentials deleted' }, 200) as any;
  } catch (error) {
    console.error('[Komodo Auth DELETE] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
