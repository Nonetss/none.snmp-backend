import { db } from '@/core/config';
import { bridgeBaseTable, bridgePortTable, bridgeFdbTable } from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getDeviceBridgeRoute } from './get.route';

export const getDeviceBridgeHandler: RouteHandler<
  typeof getDeviceBridgeRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);

  try {
    const [base] = await db
      .select()
      .from(bridgeBaseTable)
      .where(eq(bridgeBaseTable.deviceId, deviceId));

    const ports = await db
      .select()
      .from(bridgePortTable)
      .where(eq(bridgePortTable.deviceId, deviceId));

    const fdb = await db
      .select()
      .from(bridgeFdbTable)
      .where(eq(bridgeFdbTable.deviceId, deviceId));

    return c.json(
      {
        base: base
          ? {
              ...base,
              updatedAt: base.updatedAt?.toISOString() || null,
            }
          : null,
        ports: ports.map((p) => ({
          ...p,
          updatedAt: p.updatedAt?.toISOString() || null,
        })),
        fdb: fdb.map((f) => ({
          ...f,
          updatedAt: f.updatedAt?.toISOString() || null,
        })),
      },
      200,
    );
  } catch (error) {
    console.error(`[Get Device Bridge] Error for device ${id}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
