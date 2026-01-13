import type { RouteHandler } from '@hono/zod-openapi';
import type { postKomodoAuthRoute } from './post.route';
import { db } from '@/core/config';
import { komodoAuthTable } from '@/db';
import { eq } from 'drizzle-orm';

export const postKomodoAuthHandler: RouteHandler<
  typeof postKomodoAuthRoute
> = async (c) => {
  try {
    const body = c.req.valid('json');
    const existing = await db.select().from(komodoAuthTable).limit(1);

    let result;
    if (existing.length > 0) {
      const [updated] = await db
        .update(komodoAuthTable)
        .set(body)
        .where(eq(komodoAuthTable.id, existing[0].id))
        .returning();
      result = updated;
    } else {
      const [inserted] = await db
        .insert(komodoAuthTable)
        .values(body)
        .returning();
      result = inserted;
    }

    return c.json(result, 200);
  } catch (error) {
    console.error('[Komodo Auth POST] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
