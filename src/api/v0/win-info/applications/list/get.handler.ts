import { Handler } from 'hono';
import { db } from '@/core/config';
import { installedApplicationsTable, computerSystemTable } from '@/db';
import { asc, sql, eq, and } from 'drizzle-orm';

export const getApplicationNamesHandler: Handler = async (c) => {
  const results = await db
    .selectDistinct({
      name: installedApplicationsTable.DisplayName,
    })
    .from(installedApplicationsTable)
    .where(sql`${installedApplicationsTable.DisplayName} IS NOT NULL`)
    .orderBy(asc(installedApplicationsTable.DisplayName));

  return c.json(results.map((r) => r.name));
};
