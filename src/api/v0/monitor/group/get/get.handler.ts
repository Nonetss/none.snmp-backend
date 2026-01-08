import { db } from '@/core/config';
import { monitorGroupTable, deviceTable, monitorGroupDeviceTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getMonitorGroupRoute } from './get.route';

export const getMonitorGroupHandler: RouteHandler<
  typeof getMonitorGroupRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const groupId = parseInt(id, 10);

    const [group] = await db
      .select()
      .from(monitorGroupTable)
      .where(eq(monitorGroupTable.id, groupId));

    if (!group) {
      return c.json({ message: 'Group not found' }, 404) as any;
    }

    const devices = await db
      .select({
        id: deviceTable.id,
        ipv4: deviceTable.ipv4,
        name: deviceTable.name,
        subnetId: deviceTable.subnetId,
        snmpId: deviceTable.snmpAuthId,
      })
      .from(deviceTable)
      .innerJoin(
        monitorGroupDeviceTable,
        eq(deviceTable.id, monitorGroupDeviceTable.deviceId),
      )
      .where(eq(monitorGroupDeviceTable.groupId, groupId));

    return c.json(
      {
        ...group,
        deviceCount: devices.length,
        createdAt: group.createdAt.toISOString(),
        devices,
      },
      200,
    );
  } catch (error) {
    console.error('[Get Monitor Group] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
