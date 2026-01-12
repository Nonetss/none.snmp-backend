import { Handler } from 'hono';
import { db } from '@/core/config';
import { installedApplicationsTable, computerSystemTable } from '@/db';
import { asc, sql, eq, and } from 'drizzle-orm';
import { sendExcel } from '@/lib/excel';

export const getApplicationNamesHandler: Handler = async (c) => {
  const { excel } = c.req.query();
  const results = await db
    .selectDistinct({
      name: installedApplicationsTable.DisplayName,
    })
    .from(installedApplicationsTable)
    .where(sql`${installedApplicationsTable.DisplayName} IS NOT NULL`)
    .orderBy(asc(installedApplicationsTable.DisplayName));

  const names = results.map((r) => r.name);

  if (excel === 'true') {
    return sendExcel(
      c,
      names.map((name) => ({ name })),
      'application_names',
    );
  }

  return c.json(names);
};
