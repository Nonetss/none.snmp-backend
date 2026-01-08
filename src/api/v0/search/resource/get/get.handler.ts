import { db } from '@/core/config';
import { hrSWInstalledEntryTable, resourceTable } from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getDeviceResourcesRoute } from './get.route';

export const getDeviceResourcesHandler: RouteHandler<
  typeof getDeviceResourcesRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);

  try {
    const apps = await db
      .select({
        id: hrSWInstalledEntryTable.id,
        name: hrSWInstalledEntryTable.hrSWInstalledName,
        snmpId: hrSWInstalledEntryTable.hrSWInstalledID,
        type: hrSWInstalledEntryTable.hrSWInstalledType,
        installDate: hrSWInstalledEntryTable.hrSWInstalledDate,
        lastSeen: hrSWInstalledEntryTable.date,
      })
      .from(hrSWInstalledEntryTable)
      .innerJoin(
        resourceTable,
        eq(hrSWInstalledEntryTable.resourceId, resourceTable.id),
      )
      .where(eq(resourceTable.deviceId, deviceId));

    return c.json(
      apps.map((app) => ({
        ...app,
        installDate: app.installDate ? app.installDate.toISOString() : null,
        lastSeen: app.lastSeen.toISOString(),
      })),
      200,
    );
  } catch (error) {
    console.error(`[Get Device Apps] Error for device ${id}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
