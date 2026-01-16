import type { RouteHandler } from '@hono/zod-openapi';
import type { patchPangolinAuthRoute } from './patch.route';
import { db } from '@/core/config';
import { pangolinAuthTable } from '@/db';
import { eq } from 'drizzle-orm';

export const patchPangolinAuthHandler: RouteHandler<
  typeof patchPangolinAuthRoute
> = async (c) => {
  try {
    const body = c.req.valid('json');
    const [existingAuth] = await db.select().from(pangolinAuthTable).limit(1);

    if (!existingAuth) {
      return c.json({ message: 'No credentials found to update' }, 404) as any;
    }

    // Update Auth
    const authFields = { url: body.url, token: body.token };
    // Remove undefined fields
    Object.keys(authFields).forEach(
      (key) =>
        (authFields as any)[key] === undefined &&
        delete (authFields as any)[key],
    );

    let updatedAuth = existingAuth;
    if (Object.keys(authFields).length > 0) {
      const [result] = await db
        .update(pangolinAuthTable)
        .set(authFields)
        .where(eq(pangolinAuthTable.id, existingAuth.id))
        .returning();
      updatedAuth = result;
    }

    return c.json(updatedAuth, 200);
  } catch (error) {
    console.error('[Pangolin Auth PATCH] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
