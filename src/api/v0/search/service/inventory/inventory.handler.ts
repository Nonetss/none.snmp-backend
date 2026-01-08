import { db } from '@/core/config';
import { hrSWRunEntryTable, resourceTable, deviceTable } from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getServiceInventoryRoute } from './inventory.route';

export const getServiceInventoryHandler: RouteHandler<
  typeof getServiceInventoryRoute
> = async (c) => {
  const { page, pageSize } = c.req.valid('query');

  try {
    const data = await db
      .select({
        serviceName: hrSWRunEntryTable.hrSWRunName,
        deviceId: deviceTable.id,
        deviceName: deviceTable.name,
        deviceIp: deviceTable.ipv4,
      })
      .from(hrSWRunEntryTable)
      .innerJoin(
        resourceTable,
        eq(hrSWRunEntryTable.resourceId, resourceTable.id),
      )
      .innerJoin(deviceTable, eq(resourceTable.deviceId, deviceTable.id));

    const inventory = new Map<string, any>();

    for (const item of data) {
      if (!inventory.has(item.serviceName)) {
        inventory.set(item.serviceName, {
          name: item.serviceName,
          devices: [],
        });
      }

      const service = inventory.get(item.serviceName);
      if (!service.devices.find((d: any) => d.id === item.deviceId)) {
        service.devices.push({
          id: item.deviceId,
          name: item.deviceName,
          ipv4: item.deviceIp,
        });
      }
    }

    const allResults = Array.from(inventory.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    const total = allResults.length;
    const totalPages = Math.ceil(total / pageSize);
    const offset = (page - 1) * pageSize;
    const pagedResults = allResults.slice(offset, offset + pageSize);

    return c.json(
      {
        data: pagedResults,
        meta: {
          total,
          page,
          pageSize,
          totalPages,
        },
      },
      200,
    );
  } catch (error) {
    console.error('[Service Inventory] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
