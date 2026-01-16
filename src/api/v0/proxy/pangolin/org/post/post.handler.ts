import type { RouteHandler } from '@hono/zod-openapi';
import type { postPangolinOrgRoute } from './post.route';
import { db } from '@/core/config';
import { pangolinAuthTable, pangolinOrgTable } from '@/db';
import { eq } from 'drizzle-orm';

export const postPangolinOrgHandler: RouteHandler<
  typeof postPangolinOrgRoute
> = async (c) => {
  try {
    const { name, slug } = c.req.valid('json');

    const auth = await db.select().from(pangolinAuthTable).limit(1);

    if (auth.length === 0) {
      return c.json({ message: 'Pangolin credentials not found' }, 404) as any;
    }

    const authId = auth[0].id;

    const existingOrg = await db
      .select()
      .from(pangolinOrgTable)
      .where(eq(pangolinOrgTable.authId, authId))
      .limit(1);

    let orgResult;
    if (existingOrg.length > 0) {
      const [updated] = await db
        .update(pangolinOrgTable)
        .set({ name, slug })
        .where(eq(pangolinOrgTable.id, existingOrg[0].id))
        .returning();
      orgResult = updated;
    } else {
      const [inserted] = await db
        .insert(pangolinOrgTable)
        .values({
          name,
          slug,
          authId: authId,
        })
        .returning();
      orgResult = inserted;
    }

    return c.json(orgResult, 200);
  } catch (error) {
    console.error('[Pangolin Org POST] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
