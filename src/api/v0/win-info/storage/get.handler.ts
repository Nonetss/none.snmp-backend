import { Handler } from 'hono';
import { db } from '@/core/config';
import {
  diskDriveTable,
  computerSystemTable,
  networkIdentityTable,
} from '@/db';
import { eq, desc, sql, and } from 'drizzle-orm';
import { sendExcel } from '@/lib/excel';

export const getComputerStorageHandler: Handler = async (c) => {
  const { minStorage, maxStorage, excel } = c.req.valid('query' as any);
  const GB_TO_BYTES = 1024 * 1024 * 1024;

  // 1. Get the latest date ID for each computer
  const latestDatesSubquery = db
    .select({
      computerId: diskDriveTable.ComputerSystemId,
      maxDateId: sql`MAX(${diskDriveTable.DateId})`.as('max_date_id'),
    })
    .from(diskDriveTable)
    .groupBy(diskDriveTable.ComputerSystemId)
    .as('latest_dates');

  // 2. Sum disk sizes for those latest dates
  const computersWithStorage = await db
    .select({
      id: computerSystemTable.id,
      Name: computerSystemTable.Name,
      Domain: computerSystemTable.Domain,
      Manufacturer: computerSystemTable.Manufacturer,
      Model: computerSystemTable.Model,
      totalStorageBytes: sql<number>`SUM(${diskDriveTable.Size})`,
    })
    .from(computerSystemTable)
    .innerJoin(
      diskDriveTable,
      eq(computerSystemTable.id, diskDriveTable.ComputerSystemId),
    )
    .innerJoin(
      latestDatesSubquery,
      and(
        eq(diskDriveTable.ComputerSystemId, latestDatesSubquery.computerId),
        eq(diskDriveTable.DateId, latestDatesSubquery.maxDateId),
      ),
    )
    .groupBy(
      computerSystemTable.id,
      computerSystemTable.Name,
      computerSystemTable.Domain,
      computerSystemTable.Manufacturer,
      computerSystemTable.Model,
    );

  // 3. Fetch IPs
  const allIdentities = await db
    .select()
    .from(networkIdentityTable)
    .orderBy(desc(networkIdentityTable.id));

  const latestIps: Record<number, string> = {};
  for (const identity of allIdentities) {
    const iden = (identity as any).network_identity || identity;
    if (iden.ComputerSystemId && !latestIps[iden.ComputerSystemId]) {
      latestIps[iden.ComputerSystemId] = iden.IPAddress || '';
    }
  }

  // 4. Filter and Format
  let result = computersWithStorage.map((comp) => ({
    ...comp,
    totalStorageGB:
      Math.round((Number(comp.totalStorageBytes) / GB_TO_BYTES) * 100) / 100,
    ip: latestIps[comp.id] || null,
  }));

  if (minStorage) {
    result = result.filter((comp) => comp.totalStorageGB >= Number(minStorage));
  }

  if (maxStorage) {
    result = result.filter((comp) => comp.totalStorageGB <= Number(maxStorage));
  }

  if (excel === 'true') {
    return sendExcel(c, result, 'computer_storage');
  }

  return c.json(result);
};
