import type { RouteHandler } from '@hono/zod-openapi';
import type { getPangolinAuthRoute } from './get.route';
import { db } from '@/core/config';

export const getPangolinAuthHandler: RouteHandler<
  typeof getPangolinAuthRoute
> = async (c) => {
  try {
    const auth = await db.query.pangolinAuthTable.findMany({
      with: {
        pangolinOrg: true,
      },
    });

    const metadata = {
      exists: auth.length > 0,
      total_auth: auth.length,
      total_org: auth.reduce((acc, curr) => acc + curr.pangolinOrg.length, 0),
    };
    return c.json({ auth, metadata }, 200);
  } catch (error) {
    console.error('[Pangolin Auth GET] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
