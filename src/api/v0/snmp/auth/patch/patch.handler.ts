import { db } from '@/core/config';
import { snmpAuthTable } from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchAuthRoute } from './patch.route';

export const patchAuthHandler: RouteHandler<typeof patchAuthRoute> = async (
  c,
) => {
  const { id } = c.req.valid('param');
  const data = c.req.valid('json');

  try {
    const result = await db
      .update(snmpAuthTable)
      .set(data)
      .where(eq(snmpAuthTable.id, parseInt(id)))
      .returning();

    if (result.length === 0) {
      return c.json({ message: 'Authentication not found' }, 404) as any;
    }

    return c.json({ message: 'Authentication updated successfully' }, 200);
  } catch (error) {
    console.error('Error updating SNMP auth:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
