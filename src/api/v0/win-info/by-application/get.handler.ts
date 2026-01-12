import { Handler } from 'hono';
import { db } from '@/core/config';
import {
  installedApplicationsTable,
  computerSystemTable,
  networkIdentityTable,
} from '@/db';
import { eq, desc, sql, and, ilike, inArray, notInArray } from 'drizzle-orm';
import { sendExcel } from '@/lib/excel';

export const getComputersByAppHandler: Handler = async (c) => {
  const { appName, installed, excel } = c.req.valid('query' as any);
  const isInstalled = installed === 'true';

  // 1. Get the latest date ID for each computer
  const latestDatesSubquery = db
    .select({
      computerId: installedApplicationsTable.ComputerSystemId,
      maxDateId: sql`MAX(${installedApplicationsTable.DateId})`.as(
        'max_date_id',
      ),
    })
    .from(installedApplicationsTable)
    .groupBy(installedApplicationsTable.ComputerSystemId)
    .as('latest_dates');

  // 2. Find computer IDs that HAVE the application on their latest date
  const computersWithAppQuery = db
    .select({
      id: installedApplicationsTable.ComputerSystemId,
    })
    .from(installedApplicationsTable)
    .innerJoin(
      latestDatesSubquery,
      and(
        eq(
          installedApplicationsTable.ComputerSystemId,
          latestDatesSubquery.computerId,
        ),
        eq(installedApplicationsTable.DateId, latestDatesSubquery.maxDateId),
      ),
    )
    .where(ilike(installedApplicationsTable.DisplayName, `%${appName}%`))
    .groupBy(installedApplicationsTable.ComputerSystemId);

  const computersWithApp = await computersWithAppQuery;
  const computerIdsWithApp = computersWithApp.map((c) => c.id as number);

  // 3. Fetch IPs
  const allIdentities = await db
    .select()
    .from(networkIdentityTable)
    .orderBy(desc(networkIdentityTable.id));

  const latestIps: Record<number, string> = {};
  for (const identity of allIdentities) {
    const iden = (identity as any).network_identity || identity;
    const computerSystemId = iden.ComputerSystemId;
    if (computerSystemId && !latestIps[computerSystemId]) {
      latestIps[computerSystemId] = iden.IPAddress || '';
    }
  }

  // 4. Select computers based on the filter
  let computers;
  if (isInstalled) {
    if (computerIdsWithApp.length === 0) {
      computers = [];
    } else {
      computers = await db
        .select()
        .from(computerSystemTable)
        .where(inArray(computerSystemTable.id, computerIdsWithApp));
    }
  } else {
    if (computerIdsWithApp.length === 0) {
      computers = await db.select().from(computerSystemTable);
    } else {
      computers = await db
        .select()
        .from(computerSystemTable)
        .where(notInArray(computerSystemTable.id, computerIdsWithApp));
    }
  }

  const result = computers.map((comp) => ({
    ...comp,
    ip: latestIps[comp.id] || null,
  }));

  if (excel === 'true') {
    return sendExcel(c, result, 'computers_by_app');
  }

  return c.json(result);
};
