import { db } from '@/core/config';
import {
  deviceTable,
  interfaceTable,
  systemTable,
  ipAddrEntryTable,
  ipSnmpTable,
  hikvisionTable,
} from '@/db';
import { eq, or, and } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { identifyDeviceRoute } from './identify.route';
import { normalizeMac } from '@/lib/snmp';

export const identifyDeviceHandler: RouteHandler<
  typeof identifyDeviceRoute
> = async (c) => {
  const { ip, mac } = c.req.valid('query');

  try {
    const results: any[] = [];

    // 1. Buscar por IP
    if (ip) {
      // A. Como IP de gestión
      const mgmtIpMatch = await db
        .select({
          id: deviceTable.id,
          name: deviceTable.name,
          managementIp: deviceTable.ipv4,
          sysName: systemTable.sysName,
        })
        .from(deviceTable)
        .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId))
        .where(eq(deviceTable.ipv4, ip));

      for (const d of mgmtIpMatch) {
        results.push({
          ...d,
          matchType: 'management_ip',
          matchedValue: ip,
        });
      }

      // B. Como IP de interfaz
      const interfaceIpMatch = await db
        .select({
          id: deviceTable.id,
          name: deviceTable.name,
          managementIp: deviceTable.ipv4,
          sysName: systemTable.sysName,
          matchedIp: ipAddrEntryTable.ipAdEntAddr,
        })
        .from(ipAddrEntryTable)
        .innerJoin(ipSnmpTable, eq(ipAddrEntryTable.ipSnmpId, ipSnmpTable.id))
        .innerJoin(deviceTable, eq(ipSnmpTable.deviceId, deviceTable.id))
        .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId))
        .where(eq(ipAddrEntryTable.ipAdEntAddr, ip));

      for (const d of interfaceIpMatch) {
        results.push({
          id: d.id,
          name: d.name,
          managementIp: d.managementIp,
          sysName: d.sysName,
          matchType: 'interface_ip',
          matchedValue: d.matchedIp,
        });
      }
    }

    // 2. Buscar por MAC
    if (mac) {
      const formattedMac = normalizeMac(mac);

      // A. Buscar en la tabla de interfaces estándar
      const macMatch = await db
        .select({
          id: deviceTable.id,
          name: deviceTable.name,
          managementIp: deviceTable.ipv4,
          sysName: systemTable.sysName,
          matchedMac: interfaceTable.ifPhysAddress,
        })
        .from(interfaceTable)
        .innerJoin(deviceTable, eq(interfaceTable.deviceId, deviceTable.id))
        .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId))
        .where(
          or(
            eq(interfaceTable.ifPhysAddress, formattedMac || ''),
            eq(interfaceTable.ifPhysAddress, mac.toUpperCase()),
          ),
        );

      for (const d of macMatch) {
        results.push({
          id: d.id,
          name: d.name,
          managementIp: d.managementIp,
          sysName: d.sysName,
          matchType: 'mac_address',
          matchedValue: d.matchedMac,
        });
      }

      // B. Buscar en la tabla de Hikvision (por si no se detectó interfaz estándar)
      const hikMacMatch = await db
        .select({
          id: deviceTable.id,
          name: deviceTable.name,
          managementIp: deviceTable.ipv4,
          sysName: systemTable.sysName,
          matchedMac: hikvisionTable.macAddr,
        })
        .from(hikvisionTable)
        .innerJoin(deviceTable, eq(hikvisionTable.deviceId, deviceTable.id))
        .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId))
        .where(
          or(
            eq(hikvisionTable.macAddr, formattedMac || ''),
            eq(hikvisionTable.macAddr, mac.toUpperCase()),
          ),
        );

      for (const d of hikMacMatch) {
        results.push({
          id: d.id,
          name: d.name,
          managementIp: d.managementIp,
          sysName: d.sysName,
          matchType: 'mac_address',
          matchedValue: d.matchedMac,
        });
      }
    }

    // Eliminar duplicados si un mismo dispositivo coincide por varias razones
    const uniqueMap = new Map();
    for (const r of results) {
      if (!uniqueMap.has(r.id)) {
        uniqueMap.set(r.id, r);
      }
    }
    const uniqueResults = Array.from(uniqueMap.values());

    return c.json(uniqueResults, 200);
  } catch (error) {
    console.error('[Identify Device] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
