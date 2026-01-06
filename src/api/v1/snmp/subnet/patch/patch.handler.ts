import { db } from '@/core/config';
import { subnetTable } from '@/db';
import { eq } from 'drizzle-orm';
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

    return c.json(updatedSubnet, 200);
  } catch (error) {
    console.error('Error updating subnet:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
