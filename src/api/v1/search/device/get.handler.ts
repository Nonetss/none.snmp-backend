import { db } from '@/core/config';
import {
  ipAddrEntryTable,
  ipSnmpTable,
  deviceTable,
  systemTable,
  interfaceTable,
} from '@/db';
import { eq, and, or } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getDeviceSearchRoute } from './get.route';

export const getDeviceSearchHandler: RouteHandler<
  typeof getDeviceSearchRoute
> = async (c) => {
  const { q } = c.req.valid('query');
  const normalizedQ = q.toUpperCase();

  try {
    // Buscamos dispositivos donde:
    // 1. La IP asignada en ip_addr_entry sea igual a q
    // 2. O la MAC en interfaceTable sea igual a q
    const results = await db
      .select({
        deviceId: deviceTable.id,
        deviceName: deviceTable.name,
        deviceIpv4: deviceTable.ipv4,
        macAddress: interfaceTable.ifPhysAddress,
        assignedIp: ipAddrEntryTable.ipAdEntAddr,
        ifIndex: interfaceTable.ifIndex,
        ifName: interfaceTable.ifName,
        ifDescr: interfaceTable.ifDescr,
        lastSeen: interfaceTable.updatedAt,
        system: {
          sysDescr: systemTable.sysDescr,
          sysUpTime: systemTable.sysUpTime,
          sysContact: systemTable.sysContact,
          sysName: systemTable.sysName,
          sysLocation: systemTable.sysLocation,
          sysServices: systemTable.sysServices,
        },
      })
      .from(deviceTable)
      .leftJoin(ipSnmpTable, eq(deviceTable.id, ipSnmpTable.deviceId))
      .leftJoin(interfaceTable, eq(deviceTable.id, interfaceTable.deviceId))
      .leftJoin(
        ipAddrEntryTable,
        and(
          eq(ipSnmpTable.id, ipAddrEntryTable.ipSnmpId),
          eq(interfaceTable.ifIndex, ipAddrEntryTable.ipAdEntIfIndex),
        ),
      )
      .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId))
      .where(
        or(
          eq(ipAddrEntryTable.ipAdEntAddr, q),
          eq(interfaceTable.ifPhysAddress, normalizedQ),
        ),
      );

    return c.json(
      results.map((r) => ({
        ...r,
        lastSeen: r.lastSeen
          ? r.lastSeen.toISOString()
          : new Date().toISOString(),
        system: r.system
          ? {
              ...r.system,
              sysUpTime: r.system.sysUpTime
                ? r.system.sysUpTime.toISOString()
                : null,
            }
          : null,
      })),
      200,
    );
  } catch (error) {
    console.error(`[Search Device] Error searching for ${q}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
