import { db } from '@/core/config';
import { cdpNeighborTable } from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getDeviceCdpRoute } from './get.route';

export const getDeviceCdpHandler: RouteHandler<
  typeof getDeviceCdpRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);

  try {
    const neighbors = await db
      .select()
      .from(cdpNeighborTable)
      .where(eq(cdpNeighborTable.deviceId, deviceId));

    return c.json(
      neighbors.map((n) => ({
        ...n,
        updatedAt: n.updatedAt?.toISOString() || null,
      })),
      200,
    );
  } catch (error) {
    console.error(`[Get Device CDP] Error for device ${id}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
