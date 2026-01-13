import type { RouteHandler } from '@hono/zod-openapi';
import type { patchKomodoAuthRoute } from './patch.route';
import { db } from '@/core/config';
import { komodoAuthTable } from '@/db';
import { eq } from 'drizzle-orm';

export const patchKomodoAuthHandler: RouteHandler<
  typeof patchKomodoAuthRoute
> = async (c) => {
  try {
    const body = c.req.valid('json');
    const [existing] = await db.select().from(komodoAuthTable).limit(1);

    if (!existing) {
      return c.json({ message: 'No credentials found to update' }, 404) as any;
    }

    const [updated] = await db
      .update(komodoAuthTable)
      .set(body)
      .where(eq(komodoAuthTable.id, existing.id))
      .returning();

    return c.json(updated, 200);
  } catch (error) {
    console.error('[Komodo Auth PATCH] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
