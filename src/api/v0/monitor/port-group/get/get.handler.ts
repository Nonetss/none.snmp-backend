import { db } from '@/core/config';
import { monitorPortGroupTable, monitorPortGroupItemTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getMonitorPortGroupRoute } from './get.route';

export const getMonitorPortGroupHandler: RouteHandler<
  typeof getMonitorPortGroupRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const groupId = parseInt(id, 10);

    const [group] = await db
      .select()
      .from(monitorPortGroupTable)
      .where(eq(monitorPortGroupTable.id, groupId));

    if (!group) {
      return c.json({ message: 'Group not found' }, 404) as any;
    }

    const items = await db
      .select()
      .from(monitorPortGroupItemTable)
      .where(eq(monitorPortGroupItemTable.portGroupId, groupId));

    return c.json(
      {
        ...group,
        portCount: items.length,
        items,
      },
      200,
    );
  } catch (error) {
    console.error('[Get Monitor Port Group] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
