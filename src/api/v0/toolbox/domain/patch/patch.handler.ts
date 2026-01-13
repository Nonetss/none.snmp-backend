import { db } from '@/core/config';
import { domainTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchDomainRoute } from './patch.route';

export const patchDomainHandler: RouteHandler<typeof patchDomainRoute> = async (
  c,
) => {
  const { id } = c.req.valid('param');
  const data = c.req.valid('json');
  const domainId = parseInt(id, 10);

  try {
    const [updatedDomain] = await db
      .update(domainTable)
      .set(data)
      .where(eq(domainTable.id, domainId))
      .returning();

    if (!updatedDomain) {
      return c.json({ message: 'Domain not found' }, 404) as any;
    }

    return c.json(updatedDomain, 200);
  } catch (error) {
    console.error(`[Patch Domain] Error for ID ${id}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
