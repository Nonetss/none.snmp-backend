import type { RouteHandler } from '@hono/zod-openapi';
import type { getDeviceRouteRoute } from './get.route';
import { db } from '@/core/config';
import { routeTable } from '@/db';
import { eq } from 'drizzle-orm';

export const getDeviceRouteHandler: RouteHandler<
  typeof getDeviceRouteRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);

  const routes = await db
    .select()
    .from(routeTable)
    .where(eq(routeTable.deviceId, deviceId));

  return c.json(
    routes.map((r) => ({
      ...r,
      updatedAt: r.updatedAt?.toISOString() || null,
    })),
    200,
  );
};
