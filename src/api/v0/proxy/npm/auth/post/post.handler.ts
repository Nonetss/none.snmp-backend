import type { RouteHandler } from '@hono/zod-openapi';
import type { postNpmAuthRoute } from './post.route';
import { db } from '@/core/config';
import { npmAuthTable } from '@/db';
import { eq } from 'drizzle-orm';

export const postNpmAuthHandler: RouteHandler<typeof postNpmAuthRoute> = async (
  c,
) => {
  try {
    const body = c.req.valid('json');
    const existing = await db.select().from(npmAuthTable).limit(1);

    let result;
    if (existing.length > 0) {
      const [updated] = await db
        .update(npmAuthTable)
        .set(body)
        .where(eq(npmAuthTable.id, existing[0].id))
        .returning();
      result = updated;
    } else {
      const [inserted] = await db.insert(npmAuthTable).values(body).returning();
      result = inserted;
    }

    return c.json(result, 200);
  } catch (error) {
    console.error('[NPM Auth POST] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
