import { Handler } from 'hono';
import { db } from '@/core/config';
import { computerSystemTable, networkIdentityTable, dateTable } from '@/db';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import {
  biosTable,
  baseBoardTable,
  computerSystemProductTable,
  diskDriveTable,
  installedApplicationsTable,
  networkAdapterConfigTable,
  operatingSystemTable,
  physicalMemoryTable,
  processorTable,
  runningServicesTable,
} from '@/db';
import { sendExcel } from '@/lib/excel';

export const getWinInfoHandler: Handler = async (c) => {
  const { name, ip, date, tables, excel } = c.req.query();

  let computer;

  if (name) {
    const results = await db
      .select()
      .from(computerSystemTable)
      .where(eq(computerSystemTable.Name, name))
      .limit(1);
    computer = results[0];
  } else if (ip) {
    const identities = await db
      .select()
      .from(networkIdentityTable)
      .where(eq(networkIdentityTable.IPAddress, ip))
      .limit(1);

    if (identities.length > 0) {
      const results = await db
        .select()
        .from(computerSystemTable)
        .where(eq(computerSystemTable.id, identities[0].ComputerSystemId!))
        .limit(1);
      computer = results[0];
    }
  }

  if (!computer) {
    return c.json({ message: 'Computer not found' }, 404);
  }

  const requestedTables = tables ? tables.split(',') : [];

  // Find the date record
  let dateRecord;
  if (date) {
    [dateRecord] = await db
      .select()
      .from(dateTable)
      .where(eq(dateTable.date, date))
      .limit(1);
  } else {
    // Get latest available date for this computer
    const results = await db
      .select({
        id: dateTable.id,
        date: dateTable.date,
      })
      .from(dateTable)
      .innerJoin(
        operatingSystemTable,
        eq(operatingSystemTable.DateId, dateTable.id),
      )
      .where(eq(operatingSystemTable.ComputerSystemId, computer.id))
      .orderBy(desc(dateTable.date))
      .limit(1);
    dateRecord = results[0];
  }

  if (!dateRecord) {
    return c.json({ message: 'No data found for the specified date' }, 404);
  }

  const fetchTableData = async (tableName: string, table: any) => {
    if (requestedTables.length > 0 && !requestedTables.includes(tableName))
      return undefined;

    const query = db.select().from(table);

    const conditions = [
      eq(table.ComputerSystemId, computer.id),
      eq(table.DateId, dateRecord.id),
    ];

    if (tableName === 'InstalledApplications') {
      query.orderBy(table.DisplayName);
    } else if (tableName === 'RunningServices') {
      query.orderBy(table.DisplayName);
    }

    const result = await query.where(and(...conditions));

    if (
      [
        'DiskDrive',
        'InstalledApplications',
        'PhysicalMemory',
        'RunningServices',
        'NetworkIdentity',
        'NetworkAdapterConfig',
      ].includes(tableName)
    ) {
      return result;
    }
    return result[0];
  };

  const data = {
    BIOS: await fetchTableData('BIOS', biosTable),
    BaseBoard: await fetchTableData('BaseBoard', baseBoardTable),
    ComputerSystemProduct: await fetchTableData(
      'ComputerSystemProduct',
      computerSystemProductTable,
    ),
    DiskDrive: await fetchTableData('DiskDrive', diskDriveTable),
    InstalledApplications: await fetchTableData(
      'InstalledApplications',
      installedApplicationsTable,
    ),
    NetworkIdentity: await fetchTableData(
      'NetworkIdentity',
      networkIdentityTable,
    ),
    NetworkAdapterConfig: await fetchTableData(
      'NetworkAdapterConfig',
      networkAdapterConfigTable,
    ),
    OperatingSystem: await fetchTableData(
      'OperatingSystem',
      operatingSystemTable,
    ),
    PhysicalMemory: await fetchTableData('PhysicalMemory', physicalMemoryTable),
    Processor: await fetchTableData('Processor', processorTable),
    RunningServices: await fetchTableData(
      'RunningServices',
      runningServicesTable,
    ),
  };

  if (excel === 'true') {
    // Flatten result for Excel: computer system info + some key data if available
    const flatResult = [
      {
        ...computer,
        date: dateRecord.date,
        OS: (data.OperatingSystem as any)?.Caption,
        OSVersion: (data.OperatingSystem as any)?.Version,
        CPU: (data.Processor as any)?.Name,
        RAM_GB:
          ((data.PhysicalMemory as any[])?.reduce(
            (acc, curr) => acc + curr.Capacity,
            0,
          ) || 0) /
          (1024 * 1024 * 1024),
      },
    ];
    return sendExcel(c, flatResult, `win_info_${computer.Name}`);
  }

  return c.json({
    computerSystem: computer,
    date: dateRecord.date,
    data,
  });
};
