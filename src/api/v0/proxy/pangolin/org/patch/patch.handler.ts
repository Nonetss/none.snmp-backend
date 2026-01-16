import type { RouteHandler } from '@hono/zod-openapi';
import type { patchPangolinOrgRoute } from './patch.route';
import { db } from '@/core/config';
import { pangolinOrgTable } from '@/db';
import { eq } from 'drizzle-orm';

export const patchPangolinOrgHandler: RouteHandler<
  typeof patchPangolinOrgRoute
> = async (c) => {
  try {
    const body = c.req.valid('json');
    const [existingOrg] = await db.select().from(pangolinOrgTable).limit(1);

    if (!existingOrg) {
      return c.json({ message: 'Pangolin organization not found' }, 404) as any;
    }

    const orgFields = { name: body.name, slug: body.slug };
    Object.keys(orgFields).forEach(
      (key) =>
        (orgFields as any)[key] === undefined && delete (orgFields as any)[key],
    );

    let updatedOrg = existingOrg;
    if (Object.keys(orgFields).length > 0) {
      const [result] = await db
        .update(pangolinOrgTable)
        .set(orgFields)
        .where(eq(pangolinOrgTable.id, existingOrg.id))
        .returning();
      updatedOrg = result;
    }

    return c.json(updatedOrg, 200);
  } catch (error) {
    console.error('[Pangolin Org PATCH] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
