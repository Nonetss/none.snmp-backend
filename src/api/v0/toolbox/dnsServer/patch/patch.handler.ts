import { db } from '@/core/config';
import { dnsServerTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchDnsServerRoute } from './patch.route';

export const patchDnsServerHandler: RouteHandler<
  typeof patchDnsServerRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const data = c.req.valid('json');
  const serverId = parseInt(id, 10);

  try {
    const [updatedServer] = await db
      .update(dnsServerTable)
      .set(data)
      .where(eq(dnsServerTable.id, serverId))
      .returning();

    if (!updatedServer) {
      return c.json({ message: 'DNS server not found' }, 404) as any;
    }

    return c.json(updatedServer, 200);
  } catch (error) {
    console.error(`[Patch DNS Server] Error for ID ${id}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
