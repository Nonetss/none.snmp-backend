import { db } from '@/core/config';
import { domainTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getDomainRoute } from './get.route';

export const getDomainHandler: RouteHandler<typeof getDomainRoute> = async (
  c,
) => {
  const { id } = c.req.valid('param');
  const domainId = parseInt(id, 10);

  try {
    const [domain] = await db
      .select()
      .from(domainTable)
      .where(eq(domainTable.id, domainId));

    if (!domain) {
      return c.json({ message: 'Domain not found' }, 404) as any;
    }

    return c.json(domain, 200);
  } catch (error) {
    console.error(`[Get Domain] Error for ID ${id}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
