import type { RouteHandler } from '@hono/zod-openapi';
import type { getPangolinOrgRoute } from './get.route';
import { db } from '@/core/config';
import { pangolinOrgTable } from '@/db';

export const getPangolinOrgHandler: RouteHandler<
  typeof getPangolinOrgRoute
> = async (c) => {
  try {
    const org = await db.query.pangolinOrgTable.findFirst();

    return c.json(org || null, 200);
  } catch (error) {
    console.error('[Pangolin Org GET] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
