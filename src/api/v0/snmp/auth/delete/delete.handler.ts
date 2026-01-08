import { db } from '@/core/config';
import { snmpAuthTable } from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteAuthRoute } from './delete.route';

export const deleteAuthHandler: RouteHandler<typeof deleteAuthRoute> = async (
  c,
) => {
  const { id } = c.req.valid('param');

  try {
    const result = await db
      .delete(snmpAuthTable)
      .where(eq(snmpAuthTable.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return c.json({ message: 'Authentication not found' }, 404) as any;
    }

    return c.json({ message: 'Authentication deleted successfully' }, 200);
  } catch (error) {
    console.error('Error deleting SNMP auth:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
