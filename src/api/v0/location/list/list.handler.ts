import { db } from '@/core/config';
import { deviceTable, locationTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listLocationRoute } from './list.route';
import { eq, sql } from 'drizzle-orm';

export const listLocationHandler: RouteHandler<
  typeof listLocationRoute
> = async (c) => {
  try {
    const locations = await db
      .select({
        id: locationTable.id,
        name: locationTable.name,
        description: locationTable.description,
        parentId: locationTable.parentId,
        deviceCount: sql<number>`count(${deviceTable.id})::int`,
      })
      .from(locationTable)
      .leftJoin(deviceTable, eq(locationTable.id, deviceTable.locationId))
      .groupBy(locationTable.id);

    return c.json(locations, 200);
  } catch (error) {
    console.error('[List Location] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
