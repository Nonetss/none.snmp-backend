import { db } from '@/core/config';
import { domainTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listDomainRoute } from './list.route';

export const listDomainHandler: RouteHandler<typeof listDomainRoute> = async (
  c,
) => {
  try {
    const domains = await db.select().from(domainTable);
    return c.json(domains, 200);
  } catch (error) {
    console.error('[List Domain] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
