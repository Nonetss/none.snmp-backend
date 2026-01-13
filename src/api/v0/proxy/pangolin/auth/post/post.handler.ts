import type { RouteHandler } from '@hono/zod-openapi';
import type { postPangolinAuthRoute } from './post.route';
import { db } from '@/core/config';
import { pangolinAuthTable, pangolinOrgTable } from '@/db';
import { eq } from 'drizzle-orm';

export const postPangolinAuthHandler: RouteHandler<
  typeof postPangolinAuthRoute
> = async (c) => {
  try {
    const { url, token, orgName, orgSlug } = c.req.valid('json');

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

    const existingOrg = await db
      .select()
      .from(pangolinOrgTable)
      .where(eq(pangolinOrgTable.authId, authResult.id))
      .limit(1);

    let orgResult;
    if (existingOrg.length > 0) {
      const [updated] = await db
        .update(pangolinOrgTable)
        .set({ name: orgName, slug: orgSlug })
        .where(eq(pangolinOrgTable.id, existingOrg[0].id))
        .returning();
      orgResult = updated;
    } else {
      const [inserted] = await db
        .insert(pangolinOrgTable)
        .values({
          name: orgName,
          slug: orgSlug,
          authId: authResult.id,
        })
        .returning();
      orgResult = inserted;
    }

    return c.json(
      {
        ...authResult,
        org: orgResult,
      },
      200,
    );
  } catch (error) {
    console.error('[Pangolin Auth POST] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
