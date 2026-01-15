import type { RouteHandler } from '@hono/zod-openapi';
import type { getPangolinAuthRoute } from './get.route';
import { db } from '@/core/config';
import { pangolinAuthTable, pangolinOrgTable } from '@/db';
import { eq } from 'drizzle-orm';

export const getPangolinAuthHandler: RouteHandler<
  typeof getPangolinAuthRoute
> = async (c) => {
  try {
    const pangolinAuth = await db.query.pangolinAuthTable.findMany({
      with: {
        pangolinOrg: true,
      },
    });

    const metadata = {
      exists: pangolinAuth.length > 0,
      total: pangolinAuth.length,
    };

    return c.json({ pangolinAuth, metadata }, 200);
  } catch (error) {
    console.error('[Pangolin Auth GET] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
