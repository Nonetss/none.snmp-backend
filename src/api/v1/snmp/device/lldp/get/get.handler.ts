import type { RouteHandler } from '@hono/zod-openapi';
import type { getDeviceLldpRoute } from './get.route';
import { db } from '@/core/config';
import { lldpNeighborTable } from '@/db';
import { eq } from 'drizzle-orm';

export const getDeviceLldpHandler: RouteHandler<
  typeof getDeviceLldpRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);

  const neighbors = await db
    .select()
    .from(lldpNeighborTable)
    .where(eq(lldpNeighborTable.deviceId, deviceId));

  return c.json(
    neighbors.map((n) => ({
      ...n,
      updatedAt: n.updatedAt?.toISOString() || null,
    })),
    200,
  );
};
