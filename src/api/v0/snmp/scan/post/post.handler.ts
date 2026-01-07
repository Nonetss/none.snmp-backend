import { db } from '@/core/config';
import { subnetTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postScanRoute } from './post.route';
import { scanSubnet } from '@/lib/snmp/scan';

export const postScanHandler: RouteHandler<typeof postScanRoute> = async (
  c,
) => {
  const { cidr, subnetName } = c.req.valid('json');

  try {
    let [subnet] = await db
      .select()
      .from(subnetTable)
      .where(eq(subnetTable.cidr, cidr));
    if (!subnet) {
      [subnet] = await db
        .insert(subnetTable)
        .values({
          cidr,
          name: subnetName || `Subnet ${cidr}`,
        })
        .returning();
    }

    const results = await scanSubnet(subnet.id);

    return c.json({ message: 'Scan completed', results }, 200);
  } catch (error) {
    console.error('Error in scan:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
