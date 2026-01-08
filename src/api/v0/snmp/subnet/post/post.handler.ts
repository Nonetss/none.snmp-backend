import { db } from '@/core/config';
import { subnetTable } from '@/db';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postSubnetRoute } from './post.route';

export const postSubnetHandler: RouteHandler<typeof postSubnetRoute> = async (
  c,
) => {
  const { cidr, name } = c.req.valid('json');

  try {
    const [newSubnet] = await db
      .insert(subnetTable)
      .values({
        cidr,
        name: name || `Subnet ${cidr}`,
      })
      .returning();

    return c.json({ ...newSubnet, deviceCount: 0 }, 201);
  } catch (error) {
    console.error('Error creating subnet:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
