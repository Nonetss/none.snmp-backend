import { db } from '@/core/config';
import { dnsServerTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listDnsServerRoute } from './list.route';

export const listDnsServerHandler: RouteHandler<
  typeof listDnsServerRoute
> = async (c) => {
  try {
    const servers = await db.select().from(dnsServerTable);
    return c.json(servers, 200);
  } catch (error) {
    console.error('[List DNS Server] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
