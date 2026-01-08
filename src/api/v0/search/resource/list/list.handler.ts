import { db } from '@/core/config';
import { deviceTable, resourceTable, hrSWInstalledEntryTable } from '@/db';
import { eq, and, sql, notExists, exists, ilike } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getResourceSearchRoute } from './get.route';

export const getResourceSearchHandler: RouteHandler<
  typeof getResourceSearchRoute
> = async (c) => {
  const { name, installed } = c.req.valid('query');
  const shouldBeInstalled = installed === 'true';

  try {
    const subquery = (dTable: typeof deviceTable) =>
      db
        .select({ one: sql`1` })
        .from(resourceTable)
        .innerJoin(
          hrSWInstalledEntryTable,
          eq(resourceTable.id, hrSWInstalledEntryTable.resourceId),
        )
        .where(
          and(
            eq(resourceTable.deviceId, dTable.id),
            ilike(hrSWInstalledEntryTable.hrSWInstalledName, `%${name}%`),
          ),
        );

    let results;

    if (shouldBeInstalled) {
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
    console.error(`[Resource Search] Error searching for ${name}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
