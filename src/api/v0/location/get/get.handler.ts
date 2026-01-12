import { db } from '@/core/config';
import { locationTable, deviceTable, subnetTable } from '@/db';
import { eq, sql, inArray, isNull } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getLocationRoute } from './get.route';

export const getLocationHandler: RouteHandler<typeof getLocationRoute> = async (
  c,
) => {
  try {
    const { id } = c.req.valid('param');
    const locationId = parseInt(id, 10);

    if (isNaN(locationId)) {
      return c.json({ message: 'Invalid location ID' }, 400) as any;
    }

    let location: any;
    let devices: any[];

    if (locationId === -1) {
      // Caso especial: Dispositivos sin asignar
      const [countResult] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(deviceTable)
        .where(isNull(deviceTable.locationId));

      location = {
        id: -1,
        name: 'Unassigned',
        description: 'Devices with no location assigned',
        parentId: null,
        deviceCount: countResult.count,
      };

      devices = await db
        .select({
          id: deviceTable.id,
          ipv4: deviceTable.ipv4,
          name: deviceTable.name,
          subnetId: deviceTable.subnetId,
          snmpId: deviceTable.snmpAuthId,
        })
        .from(deviceTable)
        .where(isNull(deviceTable.locationId));
    } else {
      // 1. Obtener la localización base con el contador de dispositivos
      const [locationRow] = await db
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

      if (!locationRow) {
        return c.json({ message: 'Location not found' }, 404) as any;
      }
      location = locationRow;

      // 2. Obtener los dispositivos de esta localización
      devices = await db
        .select({
          id: deviceTable.id,
          ipv4: deviceTable.ipv4,
          name: deviceTable.name,
          subnetId: deviceTable.subnetId,
          snmpId: deviceTable.snmpAuthId,
        })
        .from(deviceTable)
        .where(eq(deviceTable.locationId, locationId));
    }

    // 3. Obtener las subredes implicadas
    const uniqueSubnetIds = [...new Set(devices.map((d) => d.subnetId))];
    const subnetsData =
      uniqueSubnetIds.length > 0
        ? await db
            .select()
            .from(subnetTable)
            .where(inArray(subnetTable.id, uniqueSubnetIds))
        : [];

    // Agrupar dispositivos por subred
    const subnets = subnetsData.map((s) => ({
      id: s.id,
      cidr: s.cidr,
      name: s.name,
      devices: devices.filter((d) => d.subnetId === s.id),
    }));

    // 4. Obtener sub-localizaciones
    const children =
      locationId === -1
        ? []
        : await db
            .select()
            .from(locationTable)
            .where(eq(locationTable.parentId, locationId));

    return c.json(
      {
        ...location,
        subnets,
        children,
      },
      200,
    );
  } catch (error) {
    console.error('[Get Location] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
