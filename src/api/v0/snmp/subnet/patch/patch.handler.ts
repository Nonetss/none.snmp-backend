import { db } from '@/core/config';
import { subnetTable, deviceTable } from '@/db';
import { eq, sql } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchSubnetRoute } from './patch.route';

export const patchSubnetHandler: RouteHandler<typeof patchSubnetRoute> = async (
  c,
) => {
  const { id } = c.req.valid('param');
  const updates = c.req.valid('json');

  try {
    const [updatedSubnet] = await db
      .update(subnetTable)
      .set(updates)
      .where(eq(subnetTable.id, id))
      .returning();

    if (!updatedSubnet) {
      return c.json({ message: 'Subnet not found' }, 404) as any;
    }

    // Volver a consultar para obtener el deviceCount actualizado (o el mismo)
    const [result] = await db
      .select({
        id: subnetTable.id,
        cidr: subnetTable.cidr,
        name: subnetTable.name,
        scanPingable: subnetTable.scanPingable,
        deviceCount: sql<number>`cast(count(${deviceTable.id}) as int)`,
      })
      .from(subnetTable)
      .leftJoin(deviceTable, eq(subnetTable.id, deviceTable.subnetId))
      .where(eq(subnetTable.id, id))
      .groupBy(subnetTable.id);

    return c.json(result, 200);
  } catch (error) {
    console.error('Error updating subnet:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
