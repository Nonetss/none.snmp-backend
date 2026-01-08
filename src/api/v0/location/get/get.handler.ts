import { db } from '@/core/config';
import { locationTable, deviceTable } from '@/db';
import { eq, sql } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getLocationRoute } from './get.route';

export const getLocationHandler: RouteHandler<typeof getLocationRoute> = async (
  c,
) => {
  try {
    const { id } = c.req.valid('param');
    const locationId = parseInt(id, 10);

    // 1. Obtener la localización base con el contador de dispositivos
    const [location] = await db
      .select({
        id: locationTable.id,
        name: locationTable.name,
        description: locationTable.description,
        parentId: locationTable.parentId,
        deviceCount: sql<number>`count(${deviceTable.id})::int`,
      })
      .from(locationTable)
      .leftJoin(deviceTable, eq(locationTable.id, deviceTable.locationId))
      .where(eq(locationTable.id, locationId))
      .groupBy(locationTable.id);

    if (!location) {
      return c.json({ message: 'Location not found' }, 404) as any;
    }

    // 2. Obtener los dispositivos de esta localización
    const devices = await db
      .select({
        id: deviceTable.id,
        ipv4: deviceTable.ipv4,
        name: deviceTable.name,
        subnetId: deviceTable.subnetId,
        snmpId: deviceTable.snmpAuthId,
      })
      .from(deviceTable)
      .where(eq(deviceTable.locationId, locationId));

    // 3. Obtener sub-localizaciones
    const children = await db
      .select()
      .from(locationTable)
      .where(eq(locationTable.parentId, locationId));

    return c.json(
      {
        ...location,
        devices,
        children,
      },
      200,
    );
  } catch (error) {
    console.error('[Get Location] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
