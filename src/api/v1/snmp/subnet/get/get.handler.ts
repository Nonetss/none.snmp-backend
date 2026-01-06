import { db } from '@/core/config';
import { subnetTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getSubnetRoute } from './get.route';

export const getSubnetHandler: RouteHandler<typeof getSubnetRoute> = async (
  c,
) => {
  const { id } = c.req.valid('param');

  try {
    const [subnet] = await db
      .select()
      .from(subnetTable)
      .where(eq(subnetTable.id, id));

    if (!subnet) {
      return c.json({ message: 'Subnet not found' }, 404) as any;
    }

    return c.json(subnet, 200);
  } catch (error) {
    console.error('Error getting subnet:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
