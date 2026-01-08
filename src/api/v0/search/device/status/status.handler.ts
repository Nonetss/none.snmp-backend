import { db } from '@/core/config';
import { deviceTable, deviceStatusTable } from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listDeviceStatusRoute } from './status.route';

export const listDeviceStatusHandler: RouteHandler<
  typeof listDeviceStatusRoute
> = async (c) => {
  try {
    const statuses = await db
      .select({
        deviceId: deviceTable.id,
        ipv4: deviceTable.ipv4,
        name: deviceTable.name,
        status: deviceStatusTable.status,
        lastPing: deviceStatusTable.lastPing,
        lastPingUp: deviceStatusTable.lastPingUp,
      })
      .from(deviceTable)
      .leftJoin(
        deviceStatusTable,
        eq(deviceTable.id, deviceStatusTable.deviceId),
      );

    return c.json(
      statuses.map((s) => ({
        ...s,
        status: s.status ?? false,
        lastPing: s.lastPing?.toISOString() || null,
        lastPingUp: s.lastPingUp?.toISOString() || null,
      })),
      200,
    );
  } catch (error) {
    console.error('[List Device Status] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
