import { db } from '@/core/config';
import { deviceTable, subnetTable, locationTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getSubnetsWithLocationStatusRoute } from './get.route';

export const getSubnetsWithLocationStatusHandler: RouteHandler<
  typeof getSubnetsWithLocationStatusRoute
> = async (c) => {
  try {
    const [subnets, devices, locations] = await Promise.all([
      db.select().from(subnetTable),
      db.select().from(deviceTable),
      db.select().from(locationTable),
    ]);

    const locationMap = new Map(locations.map((l) => [l.id, l]));

    const result = subnets.map((s) => {
      const subnetDevices = devices
        .filter((d) => d.subnetId === s.id)
        .map((d) => ({
          id: d.id,
          ipv4: d.ipv4,
          name: d.name,
          hasLocation: d.locationId !== null,
          location: d.locationId ? locationMap.get(d.locationId) || null : null,
        }));

      const hasLocation = subnetDevices.some((d) => d.hasLocation);

      return {
        id: s.id,
        cidr: s.cidr,
        name: s.name,
        hasLocation,
        devices: subnetDevices,
      };
    });

    return c.json(result, 200);
  } catch (error) {
    console.error('[Get Subnets Location Status] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
