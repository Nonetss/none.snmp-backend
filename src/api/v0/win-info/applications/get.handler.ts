import { Handler } from 'hono';
import { db } from '@/core/config';
import {
  installedApplicationsTable,
  computerSystemTable,
  dateTable,
} from '@/db';
import { eq, desc, inArray } from 'drizzle-orm';
import { sendExcel } from '@/lib/excel';

export const getComputerApplicationsHandler: Handler = async (c) => {
  const { excel } = c.req.query();
  // 1. Get the latest date for each computer to only show current applications
  const latestDatesQuery = db
    .select({
      computerId: installedApplicationsTable.ComputerSystemId,
      maxDateId: dateTable.id,
    })
    .from(installedApplicationsTable)
    .innerJoin(dateTable, eq(installedApplicationsTable.DateId, dateTable.id))
    .innerJoin(
      computerSystemTable,
      eq(installedApplicationsTable.ComputerSystemId, computerSystemTable.id),
    );

  const latestDates = await latestDatesQuery.orderBy(desc(dateTable.date));

  // Use a map to keep only the latest date record per computer
  const computerToLatestDate = new Map<number, number>();
  latestDates.forEach((d) => {
    if (d.computerId && !computerToLatestDate.has(d.computerId)) {
      computerToLatestDate.set(d.computerId, d.maxDateId);
    }
  });

  if (computerToLatestDate.size === 0) {
    return c.json([]);
  }

  // 2. Fetch all computers for reference
  const computers = await db.select().from(computerSystemTable);
  const computerMap = new Map(computers.map((comp) => [comp.id, comp]));

  // 3. Fetch applications matching those latest dates
  const apps = await db
    .select()
    .from(installedApplicationsTable)
    .where(
      inArray(
        installedApplicationsTable.DateId,
        Array.from(computerToLatestDate.values()),
      ),
    );

  // 4. Group by application name + publisher + version
  const grouped: Record<string, any> = {};

  apps.forEach((app) => {
    // Only include if it belongs to the latest date of that computer
    if (computerToLatestDate.get(app.ComputerSystemId!) !== app.DateId) return;

    const key = `${app.DisplayName}|${app.Publisher}|${app.DisplayVersion}`;
    if (!grouped[key]) {
      grouped[key] = {
        application: app.DisplayName,
        publisher: app.Publisher,
        version: app.DisplayVersion,
        computers: new Set<number>(),
      };
    }
    grouped[key].computers.add(app.ComputerSystemId!);
  });

  const result = Object.values(grouped)
    .map((group: any) => ({
      ...group,
      computers: Array.from(group.computers as Set<number>).map((id) => ({
        id,
        name: computerMap.get(id)?.Name || 'Unknown',
      })),
    }))
    .sort((a, b) => (a.application || '').localeCompare(b.application || ''));

  if (excel === 'true') {
    return sendExcel(c, result, 'applications');
  }

  return c.json(result);
};
