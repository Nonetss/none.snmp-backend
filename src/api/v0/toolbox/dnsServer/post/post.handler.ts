import { db } from '@/core/config';
import { dnsServerTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postDnsServerRoute } from './post.route';

export const postDnsServerHandler: RouteHandler<
  typeof postDnsServerRoute
> = async (c) => {
  const data = c.req.valid('json');

  try {
    const [newServer] = await db
      .insert(dnsServerTable)
      .values(data)
      .returning();

    return c.json(newServer, 201);
  } catch (error) {
    console.error('[Post DNS Server] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
