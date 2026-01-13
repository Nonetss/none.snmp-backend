import { db } from '@/core/config';
import { domainTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postDomainRoute } from './post.route';

export const postDomainHandler: RouteHandler<typeof postDomainRoute> = async (
  c,
) => {
  const data = c.req.valid('json');

  try {
    const [newDomain] = await db.insert(domainTable).values(data).returning();

    return c.json(newDomain, 201);
  } catch (error) {
    console.error('[Post Domain] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
