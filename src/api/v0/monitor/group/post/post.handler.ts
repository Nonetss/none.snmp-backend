import { db } from '@/core/config';
import { monitorGroupTable, monitorGroupDeviceTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postMonitorGroupRoute } from './post.route';

export const postMonitorGroupHandler: RouteHandler<
  typeof postMonitorGroupRoute
> = async (c) => {
  try {
    const { name, description, deviceIds } = c.req.valid('json');

    // 1. Crear el grupo
    const [newGroup] = await db
      .insert(monitorGroupTable)
      .values({ name, description })
      .returning();

    // 2. Si hay dispositivos, asociarlos
    if (deviceIds && deviceIds.length > 0) {
      const associations = deviceIds.map((deviceId) => ({
        groupId: newGroup.id,
        deviceId,
      }));
      await db.insert(monitorGroupDeviceTable).values(associations);
    }

    return c.json(
      {
        ...newGroup,
        deviceCount: deviceIds?.length || 0,
        createdAt: newGroup.createdAt.toISOString(),
      },
      201,
    );
  } catch (error) {
    console.error('[Post Monitor Group] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
