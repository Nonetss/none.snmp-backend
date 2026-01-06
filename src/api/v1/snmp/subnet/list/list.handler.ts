import { db } from '@/core/config';
import { subnetTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listSubnetRoute } from './list.route';

export const listSubnetHandler: RouteHandler<typeof listSubnetRoute> = async (
  c,
) => {
  try {
    const subnets = await db.select().from(subnetTable);
    return c.json(subnets, 200);
  } catch (error) {
    console.error('Error listing subnets:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
