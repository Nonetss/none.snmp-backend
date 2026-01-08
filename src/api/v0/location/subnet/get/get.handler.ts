import { db } from '@/core/config';
import { deviceTable, subnetTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getSubnetsWithLocationStatusRoute } from './get.route';

export const getSubnetsWithLocationStatusHandler: RouteHandler<
  typeof getSubnetsWithLocationStatusRoute
> = async (c) => {
  try {
    const subnets = await db.select().from(subnetTable);
    const devices = await db.select().from(deviceTable);

    const result = subnets.map((s) => {
      const subnetDevices = devices
        .filter((d) => d.subnetId === s.id)
        .map((d) => ({
          id: d.id,
          ipv4: d.ipv4,
          name: d.name,
          hasLocation: d.locationId !== null,
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
