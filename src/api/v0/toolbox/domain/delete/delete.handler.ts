import { db } from '@/core/config';
import { domainTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteDomainRoute } from './delete.route';

export const deleteDomainHandler: RouteHandler<
  typeof deleteDomainRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const domainId = parseInt(id, 10);

  try {
    const [deletedDomain] = await db
      .delete(domainTable)
      .where(eq(domainTable.id, domainId))
      .returning();

    if (!deletedDomain) {
      return c.json({ message: 'Domain not found' }, 404) as any;
    }

    return c.body(null, 204);
  } catch (error) {
    console.error(`[Delete Domain] Error for ID ${id}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
