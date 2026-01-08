import { db } from '@/core/config';
import {
  systemTable,
  interfaceTable,
  hrSWInstalledEntryTable,
  resourceTable,
  ipSnmpTable,
  ipAddrEntryTable,
  ipNetToMediaTable,
} from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getDeviceAllRoute } from './get.route';

export const getDeviceAllHandler: RouteHandler<
  typeof getDeviceAllRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);

  try {
    // 1. System
    const [system] = await db
      .select()
      .from(systemTable)
      .where(eq(systemTable.deviceId, deviceId));

    // 2. Interfaces
    const interfaces = await db
      .select()
      .from(interfaceTable)
      .where(eq(interfaceTable.deviceId, deviceId));

    // 3. Apps (Resources)
    const apps = await db
      .select()
      .from(hrSWInstalledEntryTable)
      .innerJoin(
        resourceTable,
        eq(hrSWInstalledEntryTable.resourceId, resourceTable.id),
      )
      .where(eq(resourceTable.deviceId, deviceId));

    // 4. IP
    const [ipSnmp] = await db
      .select()
      .from(ipSnmpTable)
      .where(eq(ipSnmpTable.deviceId, deviceId));
    const addresses = ipSnmp
      ? await db
          .select()
          .from(ipAddrEntryTable)
          .where(eq(ipAddrEntryTable.ipSnmpId, ipSnmp.id))
      : [];
    const arpTable = ipSnmp
      ? await db
          .select()
          .from(ipNetToMediaTable)
          .where(eq(ipNetToMediaTable.ipSnmpId, ipSnmp.id))
      : [];

    return c.json(
      {
        system: system
          ? { ...system, sysUpTime: system.sysUpTime?.toISOString() || null }
          : null,
        interfaces: interfaces.map((i) => ({
          ...i,
          updatedAt: i.updatedAt?.toISOString() || '',
        })),
        applications: apps.map(({ hr_sw_installed_entry: a }) => ({
          id: a.id,
          name: a.hrSWInstalledName,
          snmpId: a.hrSWInstalledID,
          type: a.hrSWInstalledType,
          installDate: a.hrSWInstalledDate?.toISOString() || null,
          lastSeen: a.date.toISOString(),
        })),
        network: {
          addresses: addresses.map((a) => ({
            ip: a.ipAdEntAddr,
            ifIndex: a.ipAdEntIfIndex,
            netmask: a.ipAdEntNetMask,
            broadcast: a.ipAdEntBcastAddr,
            time: a.time.toISOString(),
          })),
          arpTable: arpTable.map((a) => ({
            ifIndex: a.ipNetToMediaIfIndex,
            physAddress: a.ipNetToMediaPhysAddress,
            netAddress: a.ipNetToMediaNetAddress,
            type: a.ipNetToMediaType,
            time: a.time.toISOString(),
          })),
        },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json({ message: 'Error' }, 500) as any;
  }
};
