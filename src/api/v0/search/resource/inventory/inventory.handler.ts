import { db } from '@/core/config';
import { hrSWInstalledEntryTable, resourceTable, deviceTable } from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getApplicationInventoryRoute } from './inventory.route';

export const getApplicationInventoryHandler: RouteHandler<
  typeof getApplicationInventoryRoute
> = async (c) => {
  const { page, pageSize } = c.req.valid('query');

  try {
    const data = await db
      .select({
        appName: hrSWInstalledEntryTable.hrSWInstalledName,
        deviceId: deviceTable.id,
        deviceName: deviceTable.name,
        deviceIp: deviceTable.ipv4,
      })
      .from(hrSWInstalledEntryTable)
      .innerJoin(
        resourceTable,
        eq(hrSWInstalledEntryTable.resourceId, resourceTable.id),
      )
      .innerJoin(deviceTable, eq(resourceTable.deviceId, deviceTable.id));

    const inventory = new Map<string, any>();

    for (const item of data) {
      if (!inventory.has(item.appName)) {
        inventory.set(item.appName, {
          name: item.appName,
          devices: [],
        });
      }

      const app = inventory.get(item.appName);
      if (!app.devices.find((d: any) => d.id === item.deviceId)) {
        app.devices.push({
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
    console.error('[Application Inventory] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
