import { db } from '@/core/config';
import { monitorPortGroupTable, monitorPortGroupItemTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postMonitorPortGroupRoute } from './post.route';

export const postMonitorPortGroupHandler: RouteHandler<
  typeof postMonitorPortGroupRoute
> = async (c) => {
  try {
    const { name, description, items } = c.req.valid('json');

    // 1. Crear el grupo de puertos
    const [newGroup] = await db
      .insert(monitorPortGroupTable)
      .values({ name, description })
      .returning();

    // 2. Si hay ítems (puertos), crearlos
    if (items && items.length > 0) {
      const portEntries = items.map((item) => ({
        portGroupId: newGroup.id,
        port: item.port,
        expectedStatus: item.expectedStatus ?? true,
      }));
      await db.insert(monitorPortGroupItemTable).values(portEntries);
    }

    return c.json(
      {
        ...newGroup,
        portCount: items?.length || 0,
      },
      201,
    );
  } catch (error) {
    console.error('[Post Monitor Port Group] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
