import { db } from '@/core/config';
import { snmpAuthTable } from '@/db';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listAuthRoute } from './list.route';

export const listAuthHandler: RouteHandler<typeof listAuthRoute> = async (
  c,
) => {
  try {
    const auths = await db.select().from(snmpAuthTable);
    return c.json(auths, 200);
  } catch (error) {
    console.error('Error listing SNMP auth:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
