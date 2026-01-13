import { db } from '@/core/config';
import { dnsServerTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getDnsServerRoute } from './get.route';

export const getDnsServerHandler: RouteHandler<
  typeof getDnsServerRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const serverId = parseInt(id, 10);

  try {
    const [server] = await db
      .select()
      .from(dnsServerTable)
      .where(eq(dnsServerTable.id, serverId));

    if (!server) {
      return c.json({ message: 'DNS server not found' }, 404) as any;
    }

    return c.json(server, 200);
  } catch (error) {
    console.error(`[Get DNS Server] Error for ID ${id}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
