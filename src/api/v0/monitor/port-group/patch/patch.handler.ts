import { db } from '@/core/config';
import { monitorPortGroupTable, monitorPortGroupItemTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchMonitorPortGroupRoute } from './patch.route';

export const patchMonitorPortGroupHandler: RouteHandler<
  typeof patchMonitorPortGroupRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const groupId = parseInt(id, 10);
    const { name, description, items } = c.req.valid('json');

    const [updatedGroup] = await db
      .update(monitorPortGroupTable)
      .set({ name, description })
      .where(eq(monitorPortGroupTable.id, groupId))
      .returning();

    if (!updatedGroup) {
      return c.json({ message: 'Group not found' }, 404) as any;
    }

    if (items !== undefined) {
      // 1. Limpiar ítems actuales
      await db
        .delete(monitorPortGroupItemTable)
        .where(eq(monitorPortGroupItemTable.portGroupId, groupId));

      // 2. Insertar nuevos ítems
      if (items.length > 0) {
        const portEntries = items.map((item) => ({
          portGroupId: groupId,
          port: item.port,
          expectedStatus: item.expectedStatus ?? true,
        }));
        await db.insert(monitorPortGroupItemTable).values(portEntries);
      }
    }

    return c.json(updatedGroup, 200);
  } catch (error) {
    console.error('[Patch Monitor Port Group] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
