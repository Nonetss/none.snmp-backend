import { db } from '@/core/config';
import { subnetTable } from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteSubnetRoute } from './delete.route';

export const deleteSubnetHandler: RouteHandler<
  typeof deleteSubnetRoute
> = async (c) => {
  const { id } = c.req.valid('param');

  try {
    const [deletedSubnet] = await db
      .delete(subnetTable)
      .where(eq(subnetTable.id, id))
      .returning();

    if (!deletedSubnet) {
      return c.json({ message: 'Subnet not found' }, 404) as any;
    }

    return c.json({ message: 'Subnet deleted' }, 200);
  } catch (error) {
    console.error('Error deleting subnet:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
