import { db } from '@/core/config';
import { deviceTable, systemTable, interfaceTable, subnetTable } from '@/db';
import { eq, sql } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listDevicesRoute } from './list.route';

export const listDevicesHandler: RouteHandler<typeof listDevicesRoute> = async (
  c,
) => {
  try {
    const devices = await db
      .select({
        id: deviceTable.id,
        name: deviceTable.name,
        ipv4: deviceTable.ipv4,
        subnetId: deviceTable.subnetId,
        subnetCidr: subnetTable.cidr,
        subnetName: subnetTable.name,
        sysName: systemTable.sysName,
        sysLocation: systemTable.sysLocation,
        sysDescr: systemTable.sysDescr,
        macAddress: sql<string>`(
          SELECT if_phys_address 
          FROM ${interfaceTable} 
          WHERE ${interfaceTable.deviceId} = ${deviceTable.id} 
          AND if_phys_address IS NOT NULL 
          LIMIT 1
        )`,
      })
      .from(deviceTable)
      .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId))
      .innerJoin(subnetTable, eq(deviceTable.subnetId, subnetTable.id));

    // Agrupar por subnet
    const grouped = new Map<number, any>();

    for (const d of devices) {
      if (!grouped.has(d.subnetId)) {
        grouped.set(d.subnetId, {
          id: d.subnetId,
          cidr: d.subnetCidr,
          name: d.subnetName,
          devices: [],
        });
      }
      grouped.get(d.subnetId).devices.push({
        id: d.id,
        name: d.name,
        ipv4: d.ipv4,
        macAddress: d.macAddress,
        sysName: d.sysName,
        sysLocation: d.sysLocation,
        sysDescr: d.sysDescr,
      });
    }

    // También incluir subnets vacías
    const allSubnets = await db.select().from(subnetTable);
    for (const s of allSubnets) {
      if (!grouped.has(s.id)) {
        grouped.set(s.id, {
          id: s.id,
          cidr: s.cidr,
          name: s.name,
          devices: [],
        });
      }
    }

    return c.json(Array.from(grouped.values()), 200);
  } catch (error) {
    console.error('[List Devices] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
