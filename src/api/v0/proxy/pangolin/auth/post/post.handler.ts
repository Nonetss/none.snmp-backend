import type { RouteHandler } from '@hono/zod-openapi';
import type { postPangolinAuthRoute } from './post.route';
import { db } from '@/core/config';
import { pangolinAuthTable } from '@/db';
import { eq } from 'drizzle-orm';

export const postPangolinAuthHandler: RouteHandler<
  typeof postPangolinAuthRoute
> = async (c) => {
  try {
    const { url, token } = c.req.valid('json');

    const existingAuth = await db.select().from(pangolinAuthTable).limit(1);

    let authResult;
    if (existingAuth.length > 0) {
      const [updated] = await db
        .update(pangolinAuthTable)
        .set({ url, token })
        .where(eq(pangolinAuthTable.id, existingAuth[0].id))
        .returning();
      authResult = updated;
    } else {
      const [inserted] = await db
        .insert(pangolinAuthTable)
        .values({ url, token })
        .returning();
      authResult = inserted;
    }

    return c.json(authResult, 200);
  } catch (error) {
    console.error('[Pangolin Auth POST] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
