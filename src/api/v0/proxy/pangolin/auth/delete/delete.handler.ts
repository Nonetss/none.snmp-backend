import type { RouteHandler } from '@hono/zod-openapi';
import type { deletePangolinAuthRoute } from './delete.route';
import { db } from '@/core/config';
import { pangolinAuthTable, pangolinOrgTable } from '@/db';

export const deletePangolinAuthHandler: RouteHandler<
  typeof deletePangolinAuthRoute
> = async (c) => {
  try {
    await db.delete(pangolinOrgTable);
    await db.delete(pangolinAuthTable);
    return c.json({ message: 'Pangolin credentials deleted' }, 200) as any;
  } catch (error) {
    console.error('[Pangolin Auth DELETE] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
