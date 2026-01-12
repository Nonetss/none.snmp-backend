import { Handler } from 'hono';
import { db } from '@/core/config';
import {
  baseBoardTable,
  biosTable,
  computerSystemTable,
  computerSystemProductTable,
  dateTable,
  diskDriveTable,
  networkAdapterConfigTable,
  networkIdentityTable,
  operatingSystemTable,
  physicalMemoryTable,
  processorTable,
  installedApplicationsTable,
  runningServicesTable,
} from '@/db';
import { eq, and } from 'drizzle-orm';
import { PostData } from './post.schema';

const sanitize = (val: any): any => {
  if (typeof val === 'string') {
    return val.replace(/\0/g, '');
  }
  if (Array.isArray(val)) {
    return val.map(sanitize);
  }
  if (typeof val === 'object' && val !== null) {
    const newObj: any = {};
    for (const key in val) {
      newObj[key] = sanitize(val[key]);
    }
    return newObj;
  }
  return val;
};

const fixDate = (dateStr: string | null | undefined): string | null => {
  if (!dateStr) return null;
  const s = dateStr.trim();
  if (/^\d{8}$/.test(s)) {
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  }
  const normalized = s.replace(/\//g, '-').replace(/\s+/g, '0');
  const match = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(
      2,
      '0',
    )}`;
  }
  return null;
};

export const postHandler: Handler = async (c) => {
  const rawPayload = await c.req.json();
  const payload = sanitize(rawPayload) as PostData;
  const {
    ComputerSystem,
    BIOS,
    BaseBoard,
    ComputerSystemProduct,
    DiskDrive,
    InstalledApplications,
    NetworkIdentity,
    NetworkAdapterConfig,
    OperatingSystem,
    PhysicalMemory,
    Processor,
    RunningServices,
  } = payload;

  const applications = InstalledApplications.map((app) => ({
    ...app,
    InstallDate: fixDate(app.InstallDate),
  }));

  const services = (RunningServices || []).map((s) => ({
    Name: s.Name,
    DisplayName: s.DisplayName,
    Status: s.State,
    StartType: s.StartMode,
  }));

  const today = new Date().toISOString().split('T')[0];

  // 1. Get or create Date
  let dateRecord = await db.query.dateTable.findFirst({
    where: {
      date: {
        eq: today,
      },
    },
  });

  if (!dateRecord) {
    [dateRecord] = await db
      .insert(dateTable)
      .values({
        date: today,
      })
      .returning();
  }
  const dateId = dateRecord.id;

  // 2. Get or create/update ComputerSystem
  let computerSystem = await db.query.computerSystemTable.findFirst({
    where: {
      Name: {
        eq: ComputerSystem.Name,
      },
    },
  });

  if (!computerSystem) {
    [computerSystem] = await db
      .insert(computerSystemTable)
      .values({
        Name: ComputerSystem.Name,
        Domain: ComputerSystem.Domain,
        Manufacturer: ComputerSystem.Manufacturer,
        Model: ComputerSystem.Model,
        TotalPhysicalMemory: ComputerSystem.TotalPhysicalMemory,
      })
      .returning();
  } else {
    // Update it to the latest info
    await db
      .update(computerSystemTable)
      .set({
        Domain: ComputerSystem.Domain,
        Manufacturer: ComputerSystem.Manufacturer,
        Model: ComputerSystem.Model,
        TotalPhysicalMemory: ComputerSystem.TotalPhysicalMemory,
      })
      .where(eq(computerSystemTable.id, computerSystem.id));
  }
  const computerSystemId = computerSystem.id;

  const common = {
    ComputerSystemId: computerSystemId,
    DateId: dateId,
  };

  // Helper for cleanup and insert
  const sync = async (table: any, data: any) => {
    await db
      .delete(table)
      .where(
        and(
          eq(table.ComputerSystemId, computerSystemId),
          eq(table.DateId, dateId),
        ),
      );
    if (Array.isArray(data)) {
      if (data.length > 0) {
        await db
          .insert(table)
          .values(data.map((item) => ({ ...item, ...common })));
      }
    } else {
      await db.insert(table).values({ ...data, ...common });
    }
  };

  // Sync all tables
  await Promise.all([
    sync(biosTable, BIOS),
    sync(baseBoardTable, BaseBoard),
    sync(computerSystemProductTable, ComputerSystemProduct),
    sync(networkIdentityTable, NetworkIdentity),
    sync(networkAdapterConfigTable, NetworkAdapterConfig),
    sync(operatingSystemTable, OperatingSystem),
    sync(processorTable, Processor),
    sync(diskDriveTable, DiskDrive),
    sync(physicalMemoryTable, PhysicalMemory),
    sync(installedApplicationsTable, applications),
    sync(runningServicesTable, services),
  ]);

  return c.json({
    status: 'success',
    computerSystemId,
    date: today,
  });
};
