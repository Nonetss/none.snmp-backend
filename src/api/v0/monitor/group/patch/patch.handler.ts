import { db } from '@/core/config';
import { monitorGroupTable, monitorGroupDeviceTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchMonitorGroupRoute } from './patch.route';

export const patchMonitorGroupHandler: RouteHandler<
  typeof patchMonitorGroupRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const groupId = parseInt(id, 10);
    const { name, description, deviceIds } = c.req.valid('json');

    const [updatedGroup] = await db
      .update(monitorGroupTable)
      .set({ name, description })
      .where(eq(monitorGroupTable.id, groupId))
      .returning();

    if (!updatedGroup) {
      return c.json({ message: 'Group not found' }, 404) as any;
    }

    if (deviceIds !== undefined) {
      // 1. Limpiar asociaciones actuales
      await db
        .delete(monitorGroupDeviceTable)
        .where(eq(monitorGroupDeviceTable.groupId, groupId));

      // 2. Insertar nuevas asociaciones si hay
      if (deviceIds.length > 0) {
        const associations = deviceIds.map((deviceId) => ({
          groupId,
          deviceId,
        }));
        await db.insert(monitorGroupDeviceTable).values(associations);
      }
    }

    return c.json(
      {
        ...updatedGroup,
        createdAt: updatedGroup.createdAt.toISOString(),
      },
      200,
    );
  } catch (error) {
    console.error('[Patch Monitor Group] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
