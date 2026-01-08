import { db } from '@/core/config';
import { interfaceTable } from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getDeviceInterfacesRoute } from './get.route';

export const getDeviceInterfacesHandler: RouteHandler<
  typeof getDeviceInterfacesRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);

  try {
    const interfaces = await db
      .select()
      .from(interfaceTable)
      .where(eq(interfaceTable.deviceId, deviceId));

    return c.json(
      interfaces.map((iface) => ({
        ...iface,
        updatedAt: iface.updatedAt
          ? iface.updatedAt.toISOString()
          : new Date().toISOString(),
      })),
      200,
    );
  } catch (error) {
    console.error(`[Get Device Interfaces] Error for device ${id}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
