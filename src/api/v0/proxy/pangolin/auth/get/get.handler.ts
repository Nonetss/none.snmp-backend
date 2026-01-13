import type { RouteHandler } from '@hono/zod-openapi';
import type { getPangolinAuthRoute } from './get.route';
import { db } from '@/core/config';
import { pangolinAuthTable, pangolinOrgTable } from '@/db';
import { eq } from 'drizzle-orm';

export const getPangolinAuthHandler: RouteHandler<
  typeof getPangolinAuthRoute
> = async (c) => {
  try {
    const [auth] = await db.select().from(pangolinAuthTable).limit(1);
    if (!auth) return c.json(null, 200);

    const [org] = await db
      .select()
      .from(pangolinOrgTable)
      .where(eq(pangolinOrgTable.authId, auth.id))
      .limit(1);

    return c.json(
      {
        ...auth,
        org: org || null,
      },
      200,
    );
  } catch (error) {
    console.error('[Pangolin Auth GET] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
