import { db } from '@/core/config';
import { snmpAuthTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postAuthRoute } from './post.route';
import { logger } from '@/lib/logger';

export const postAuthHandler: RouteHandler<typeof postAuthRoute> = async (
  c,
) => {
  const data = c.req.valid('json');

  try {
    const [inserted] = await db.insert(snmpAuthTable).values(data).returning();

    return c.json(
      {
        id: inserted.id,
        message: 'Authentication created successfully',
      },
      200,
    );
  } catch (error) {
    logger.error({ error }, 'Error creating SNMP auth');
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
