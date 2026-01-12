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
  deviceTable,
  interfaceTable,
} from '@/db';
import { eq, and, inArray } from 'drizzle-orm';
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

const normalizeMac = (mac: string | null | undefined): string | null => {
  if (!mac) return null;
  return mac.toUpperCase().replace(/[^0-9A-F]/g, '');
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

  // 1.5. Find matching device by IP
  const identitiesData = Array.isArray(NetworkIdentity)
    ? NetworkIdentity
    : [NetworkIdentity];
  const ips = identitiesData
    .map((ni) => ni?.IPAddress)
    .filter((ip): ip is string => !!ip);

  let deviceId: number | null = null;
  if (ips.length > 0) {
    const matchingDevice = await db
      .select({ id: deviceTable.id })
      .from(deviceTable)
      .where(inArray(deviceTable.ipv4, ips))
      .limit(1);

    if (matchingDevice.length > 0) {
      deviceId = matchingDevice[0].id;
    }
  }

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
        deviceId,
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
        deviceId: deviceId || computerSystem.deviceId,
      })
      .where(eq(computerSystemTable.id, computerSystem.id));
  }
  const computerSystemId = computerSystem.id;

  // 2.5. Resolve Interface IDs for Network Identities
  const networkIdentitiesWithRefs = await Promise.all(
    identitiesData.map(async (ni) => {
      let interfaceId: number | null = null;
      const cleanNiMac = normalizeMac(ni.MACAddress);

      if (cleanNiMac) {
        // Fetch interfaces for this device (or all if device not found)
        let query = db.select().from(interfaceTable);
        if (deviceId) {
          query = query.where(eq(interfaceTable.deviceId, deviceId)) as any;
        }
        const interfaces = await query;

        const matchingInterface = interfaces.find(
          (i) => normalizeMac(i.ifPhysAddress) === cleanNiMac,
        );

        if (matchingInterface) {
          interfaceId = matchingInterface.id;
        }
      }
      return {
        ...ni,
        interfaceId,
      };
    }),
  );

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
    sync(networkIdentityTable, networkIdentitiesWithRefs),
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
