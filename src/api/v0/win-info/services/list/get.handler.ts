import { Handler } from 'hono';
import { db } from '@/core/config';
import { runningServicesTable, computerSystemTable } from '@/db';
import { asc, sql, eq, and } from 'drizzle-orm';
import { sendExcel } from '@/lib/excel';

export const getServiceNamesHandler: Handler = async (c) => {
  const { excel } = c.req.query();
  const results = await db
    .selectDistinct({
      name: runningServicesTable.Name,
    })
    .from(runningServicesTable)
    .where(sql`${runningServicesTable.Name} IS NOT NULL`)
    .orderBy(asc(runningServicesTable.Name));

  const names = results.map((r) => r.name);

  if (excel === 'true') {
    return sendExcel(
      c,
      names.map((name) => ({ name })),
      'service_names',
    );
  }

  return c.json(names);
};
