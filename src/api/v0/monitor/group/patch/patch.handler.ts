import { db } from '@/core/config';
import { monitorGroupTable, monitorGroupDeviceTable } from '@/db';
import { eq, sql } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchMonitorGroupRoute } from './patch.route';

export const patchMonitorGroupHandler: RouteHandler<
  typeof patchMonitorGroupRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const groupId = parseInt(id, 10);
    const { name, description, deviceIds } = c.req.valid('json');

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    let updatedGroup: any;

    if (Object.keys(updateData).length > 0) {
      [updatedGroup] = await db
        .update(monitorGroupTable)
        .set(updateData)
        .where(eq(monitorGroupTable.id, groupId))
        .returning();
    } else {
      [updatedGroup] = await db
        .select()
        .from(monitorGroupTable)
        .where(eq(monitorGroupTable.id, groupId));
    }

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

    // Obtener el conteo actualizado de dispositivos
    const [countResult] = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(monitorGroupDeviceTable)
      .where(eq(monitorGroupDeviceTable.groupId, groupId));

    return c.json(
      {
        ...updatedGroup,
        deviceCount: countResult?.count || 0,
        createdAt: updatedGroup.createdAt.toISOString(),
      },
      200,
    );
  } catch (error) {
    console.error('[Patch Monitor Group] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
