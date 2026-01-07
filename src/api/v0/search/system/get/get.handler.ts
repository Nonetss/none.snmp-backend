import { db } from '@/core/config';
import { systemTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getDeviceSystemRoute } from './get.route';

export const getDeviceSystemHandler: RouteHandler<
  typeof getDeviceSystemRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);
  try {
    const [system] = await db
      .select()
      .from(systemTable)
      .where(eq(systemTable.deviceId, deviceId));
    if (!system)
      return c.json(
        {
          sysDescr: null,
          sysUpTime: null,
          sysContact: null,
          sysName: null,
          sysLocation: null,
          sysServices: null,
        },
        200,
      );
    return c.json(
      {
        ...system,
        sysUpTime: system.sysUpTime?.toISOString() || null,
      },
      200,
    );
  } catch (error) {
    return c.json({ message: 'Error' }, 500) as any;
  }
};
