import { db } from '@/core/config';
import { snmpAuthTable } from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getAuthRoute } from './get.route';

export const getAuthHandler: RouteHandler<typeof getAuthRoute> = async (c) => {
  const { id } = c.req.valid('param');

  try {
    const [auth] = await db
      .select()
      .from(snmpAuthTable)
      .where(eq(snmpAuthTable.id, parseInt(id)));

    if (!auth) {
      return c.json({ message: 'Authentication not found' }, 404) as any;
    }

    return c.json(auth, 200);
  } catch (error) {
    console.error('Error getting SNMP auth:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
