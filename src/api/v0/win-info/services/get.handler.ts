import { Handler } from 'hono';
import { db } from '@/core/config';
import { runningServicesTable, computerSystemTable, dateTable } from '@/db';
import { eq, desc, inArray } from 'drizzle-orm';
import { sendExcel } from '@/lib/excel';

export const getComputerServicesHandler: Handler = async (c) => {
  const { excel } = c.req.query();
  // 1. Get the latest date for each computer to only show current services
  const latestDatesQuery = db
    .select({
      computerId: runningServicesTable.ComputerSystemId,
      maxDateId: dateTable.id,
    })
    .from(runningServicesTable)
    .innerJoin(dateTable, eq(runningServicesTable.DateId, dateTable.id))
    .innerJoin(
      computerSystemTable,
      eq(runningServicesTable.ComputerSystemId, computerSystemTable.id),
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

  // 3. Fetch services matching those latest dates
  const services = await db
    .select()
    .from(runningServicesTable)
    .where(
      inArray(
        runningServicesTable.DateId,
        Array.from(computerToLatestDate.values()),
      ),
    );

  // 4. Group by service name
  const grouped: Record<string, any> = {};

  services.forEach((s) => {
    // Only include if it belongs to the latest date of that computer
    if (computerToLatestDate.get(s.ComputerSystemId!) !== s.DateId) return;

    const key = s.Name;
    if (!grouped[key]) {
      grouped[key] = {
        service: s.Name,
        displayName: s.DisplayName,
        status: s.Status,
        startType: s.StartType,
        computers: new Set<number>(),
      };
    }
    grouped[key].computers.add(s.ComputerSystemId!);
  });

  const result = Object.values(grouped)
    .map((group: any) => ({
      ...group,
      computers: Array.from(group.computers as Set<number>).map((id) => ({
        id,
        name: computerMap.get(id)?.Name || 'Unknown',
      })),
    }))
    .sort((a, b) => (a.service || '').localeCompare(b.service || ''));

  if (excel === 'true') {
    return sendExcel(c, result, 'computer_services');
  }

  return c.json(result);
};
