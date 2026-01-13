import { db } from '@/core/config';
import { dnsServerTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteDnsServerRoute } from './delete.route';

export const deleteDnsServerHandler: RouteHandler<
  typeof deleteDnsServerRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const serverId = parseInt(id, 10);

  try {
    const [deletedServer] = await db
      .delete(dnsServerTable)
      .where(eq(dnsServerTable.id, serverId))
      .returning();

    if (!deletedServer) {
      return c.json({ message: 'DNS server not found' }, 404) as any;
    }

    return c.body(null, 204);
  } catch (error) {
    console.error(`[Delete DNS Server] Error for ID ${id}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
