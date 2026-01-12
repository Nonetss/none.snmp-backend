import { Handler } from 'hono';
import { db } from '@/core/config';
import {
  runningServicesTable,
  computerSystemTable,
  networkIdentityTable,
} from '@/db';
import {
  eq,
  desc,
  sql,
  and,
  ilike,
  inArray,
  notInArray,
  or,
} from 'drizzle-orm';
import { sendExcel } from '@/lib/excel';

export const getComputersByServiceHandler: Handler = async (c) => {
  const { serviceName, running, excel } = c.req.query();
  const isRunning = running === 'true';

  // 1. Get the latest date ID for each computer
  const latestDatesSubquery = db
    .select({
      computerId: runningServicesTable.ComputerSystemId,
      maxDateId: sql`MAX(${runningServicesTable.DateId})`.as('max_date_id'),
    })
    .from(runningServicesTable)
    .groupBy(runningServicesTable.ComputerSystemId)
    .as('latest_dates');

  // 2. Find computer IDs that HAVE the service on their latest date
  const computersWithServiceQuery = db
    .select({
      id: runningServicesTable.ComputerSystemId,
    })
    .from(runningServicesTable)
    .innerJoin(
      latestDatesSubquery,
      and(
        eq(
          runningServicesTable.ComputerSystemId,
          latestDatesSubquery.computerId,
        ),
        eq(runningServicesTable.DateId, latestDatesSubquery.maxDateId),
      ),
    )
    .where(
      or(
        ilike(runningServicesTable.Name, `%${serviceName}%`),
        ilike(runningServicesTable.DisplayName, `%${serviceName}%`),
      ),
    )
    .groupBy(runningServicesTable.ComputerSystemId);

  const computersWithService = await computersWithServiceQuery;
  const computerIdsWithService = computersWithService.map(
    (c) => c.id as number,
  );

  // 3. Fetch IPs
  const allIdentities = await db
    .select()
    .from(networkIdentityTable)
    .orderBy(desc(networkIdentityTable.id));

  const latestIps: Record<number, string> = {};
  for (const identity of allIdentities) {
    // Handle the case where the identity is wrapped due to the join
    const iden = (identity as any).network_identity || identity;
    if (iden.ComputerSystemId && !latestIps[iden.ComputerSystemId]) {
      latestIps[iden.ComputerSystemId] = iden.IPAddress || '';
    }
  }

  // 4. Select computers based on the filter
  let computers: (typeof computerSystemTable.$inferSelect)[];
  if (isRunning) {
    if (computerIdsWithService.length === 0) {
      computers = [];
    } else {
      computers = await db
        .select()
        .from(computerSystemTable)
        .where(inArray(computerSystemTable.id, computerIdsWithService));
    }
  } else {
    if (computerIdsWithService.length === 0) {
      computers = await db.select().from(computerSystemTable);
    } else {
      computers = await db
        .select()
        .from(computerSystemTable)
        .where(notInArray(computerSystemTable.id, computerIdsWithService));
    }
  }

  const result = computers.map((comp) => ({
    ...comp,
    ip: latestIps[comp.id] || null,
  }));

  if (excel === 'true') {
    return sendExcel(c, result, 'computers_by_service');
  }

  return c.json(result);
};
