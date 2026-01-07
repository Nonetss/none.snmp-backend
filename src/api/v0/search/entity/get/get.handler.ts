import type { RouteHandler } from '@hono/zod-openapi';
import type { getDeviceEntityRoute } from './get.route';
import { db } from '@/core/config';
import { entityPhysicalTable } from '@/db';
import { eq } from 'drizzle-orm';

export const getDeviceEntityHandler: RouteHandler<
  typeof getDeviceEntityRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);

  const entities = await db
    .select()
    .from(entityPhysicalTable)
    .where(eq(entityPhysicalTable.deviceId, deviceId));

  return c.json(
    entities.map((e) => ({
      ...e,
      mfgDate: e.mfgDate?.toISOString() || null,
      updatedAt: e.updatedAt?.toISOString() || null,
    })),
    200,
  );
};
