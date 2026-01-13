import type { RouteHandler } from '@hono/zod-openapi';
import type { patchNpmAuthRoute } from './patch.route';
import { db } from '@/core/config';
import { npmAuthTable } from '@/db';
import { eq } from 'drizzle-orm';

export const patchNpmAuthHandler: RouteHandler<
  typeof patchNpmAuthRoute
> = async (c) => {
  try {
    const body = c.req.valid('json');
    const [existing] = await db.select().from(npmAuthTable).limit(1);

    if (!existing) {
      return c.json({ message: 'No credentials found to update' }, 404) as any;
    }

    const [updated] = await db
      .update(npmAuthTable)
      .set(body)
      .where(eq(npmAuthTable.id, existing.id))
      .returning();

    return c.json(updated, 200);
  } catch (error) {
    console.error('[NPM Auth PATCH] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
