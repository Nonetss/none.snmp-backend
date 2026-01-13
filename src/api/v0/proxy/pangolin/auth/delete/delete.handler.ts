import type { RouteHandler } from '@hono/zod-openapi';
import type { deletePangolinAuthRoute } from './delete.route';
import { db } from '@/core/config';
import { pangolinAuthTable, pangolinOrgTable } from '@/db';
import { eq } from 'drizzle-orm';

export const deletePangolinAuthHandler: RouteHandler<
  typeof deletePangolinAuthRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const authId = parseInt(id, 10);

    // First delete associated orgs
    await db
      .delete(pangolinOrgTable)
      .where(eq(pangolinOrgTable.authId, authId));

    // Then delete the auth
    const result = await db
      .delete(pangolinAuthTable)
      .where(eq(pangolinAuthTable.id, authId))
      .returning();

    if (result.length === 0) {
      return c.json({ message: 'Credentials not found' }, 404) as any;
    }

    return c.json({ message: 'Pangolin credentials deleted' }, 200) as any;
  } catch (error) {
    console.error('[Pangolin Auth DELETE] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
