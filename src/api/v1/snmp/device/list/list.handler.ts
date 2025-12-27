import { db } from '@/core/config';
import { deviceTable, subnetTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listDeviceRoute } from './list.route';

export const listDeviceHandler: RouteHandler<typeof listDeviceRoute> = async (
  c,
) => {
  const { subnetId } = c.req.valid('query');

  try {
    let query = db
      .select({
        id: deviceTable.id,
        ipv4: deviceTable.ipv4,
        name: deviceTable.name,
        subnetId: deviceTable.subnetId,
        snmpId: deviceTable.snmpId,
        subnet: {
          cidr: subnetTable.cidr,
          name: subnetTable.name,
        },
      })
      .from(deviceTable)
      .leftJoin(subnetTable, eq(deviceTable.subnetId, subnetTable.id));

    if (subnetId) {
      query = query.where(eq(deviceTable.subnetId, parseInt(subnetId))) as any;
    }

    const devices = await query;
    return c.json(devices, 200);
  } catch (error) {
    console.error('Error listing devices:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
