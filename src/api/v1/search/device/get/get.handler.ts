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

  // Normalizar la entrada: si es MAC, quitar separadores y pasar a Upper
  const cleanQ = q.replace(/[:.-]/g, '').toUpperCase();
  const isMac = /^[0-9A-F]{12}$/.test(cleanQ);
  const formattedMac = isMac ? cleanQ.match(/.{1,2}/g)?.join(':') : null;

  try {
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
      .leftJoin(interfaceTable, eq(deviceTable.id, interfaceTable.deviceId))
      .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId))
      .leftJoin(ipSnmpTable, eq(deviceTable.id, ipSnmpTable.deviceId))
      .leftJoin(
        ipAddrEntryTable,
        and(
          eq(ipSnmpTable.id, ipAddrEntryTable.ipSnmpId),
          eq(interfaceTable.ifIndex, ipAddrEntryTable.ipAdEntIfIndex),
        ),
      )
      .where(
        or(
          eq(deviceTable.ipv4, q),
          eq(ipAddrEntryTable.ipAdEntAddr, q),
          formattedMac
            ? eq(interfaceTable.ifPhysAddress, formattedMac)
            : undefined,
          eq(interfaceTable.ifPhysAddress, q.toUpperCase()),
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
