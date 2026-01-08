import { db } from '@/core/config';
import { deviceTable, resourceTable, hrSWRunEntryTable } from '@/db';
import { eq, and, sql, notExists, exists, ilike } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getServiceSearchRoute } from './get.route';

export const getServiceSearchHandler: RouteHandler<
  typeof getServiceSearchRoute
> = async (c) => {
  const { name, running } = c.req.valid('query');
  const shouldBeRunning = running === 'true';

  try {
    const subquery = (dTable: typeof deviceTable) =>
      db
        .select({ one: sql`1` })
        .from(resourceTable)
        .innerJoin(
          hrSWRunEntryTable,
          eq(resourceTable.id, hrSWRunEntryTable.resourceId),
        )
        .where(
          and(
            eq(resourceTable.deviceId, dTable.id),
            ilike(hrSWRunEntryTable.hrSWRunName, `%${name}%`),
          ),
        );

    let results;

    if (shouldBeRunning) {
      results = await db
        .select({
          id: deviceTable.id,
          ipv4: deviceTable.ipv4,
          name: deviceTable.name,
        })
        .from(deviceTable)
        .where(exists(subquery(deviceTable)));
    } else {
      results = await db
        .select({
          id: deviceTable.id,
          ipv4: deviceTable.ipv4,
          name: deviceTable.name,
        })
        .from(deviceTable)
        .where(notExists(subquery(deviceTable)));
    }

    return c.json(results, 200);
  } catch (error) {
    console.error(`[Service Search] Error searching for ${name}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
