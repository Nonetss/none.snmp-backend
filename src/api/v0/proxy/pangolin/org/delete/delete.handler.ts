import type { RouteHandler } from '@hono/zod-openapi';
import type { deletePangolinOrgRoute } from './delete.route';
import { db } from '@/core/config';
import { pangolinOrgTable } from '@/db';
import { eq } from 'drizzle-orm';

export const deletePangolinOrgHandler: RouteHandler<
  typeof deletePangolinOrgRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const orgId = parseInt(id, 10);

    const result = await db
      .delete(pangolinOrgTable)
      .where(eq(pangolinOrgTable.id, orgId))
      .returning();

    if (result.length === 0) {
      return c.json({ message: 'Organization not found' }, 404) as any;
    }

    return c.json({ message: 'Pangolin organization deleted' }, 200) as any;
  } catch (error) {
    console.error('[Pangolin Org DELETE] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
