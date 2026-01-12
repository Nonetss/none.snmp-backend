import { Handler } from 'hono';
import { db } from '@/core/config';
import { runningServicesTable, computerSystemTable } from '@/db';
import { asc, sql, eq, and } from 'drizzle-orm';

export const getServiceNamesHandler: Handler = async (c) => {
  const results = await db
    .selectDistinct({
      name: runningServicesTable.Name,
    })
    .from(runningServicesTable)
    .where(sql`${runningServicesTable.Name} IS NOT NULL`)
    .orderBy(asc(runningServicesTable.Name));

  return c.json(results.map((r) => r.name));
};
