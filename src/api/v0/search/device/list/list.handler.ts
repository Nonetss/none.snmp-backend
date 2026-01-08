import { db } from '@/core/config';
import {
  deviceTable,
  systemTable,
  interfaceTable,
  subnetTable,
  hikvisionTable,
  deviceStatusTable,
  deviceTagTable,
  tagTable,
  locationTable,
} from '@/db';
import { eq, sql, inArray } from 'drizzle-orm';
import { logger } from '@/lib/logger';
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
        status: deviceStatusTable.status,
        hikMac: hikvisionTable.macAddr,
        locationId: locationTable.id,
        locationName: locationTable.name,
        locationDescription: locationTable.description,
        locationParentId: locationTable.parentId,
        macAddress: sql<string>`(
          SELECT if_phys_address 
          FROM ${interfaceTable} 
          WHERE ${interfaceTable.deviceId} = ${deviceTable.id} 
          AND if_phys_address IS NOT NULL AND if_phys_address != ''
          LIMIT 1
        )`,
      })
      .from(deviceTable)
      .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId))
      .leftJoin(hikvisionTable, eq(deviceTable.id, hikvisionTable.deviceId))
      .leftJoin(locationTable, eq(deviceTable.locationId, locationTable.id))
      .leftJoin(
        deviceStatusTable,
        eq(deviceTable.id, deviceStatusTable.deviceId),
      )
      .innerJoin(subnetTable, eq(deviceTable.subnetId, subnetTable.id));

    // Obtener todas las etiquetas vinculadas a estos dispositivos
    const deviceIds = devices.map((d) => d.id);
    const tagsMap = new Map<number, any[]>();

    if (deviceIds.length > 0) {
      const allDeviceTags = await db
        .select({
          deviceId: deviceTagTable.deviceId,
          tag: tagTable,
        })
        .from(deviceTagTable)
        .innerJoin(tagTable, eq(deviceTagTable.tagId, tagTable.id))
        .where(inArray(deviceTagTable.deviceId, deviceIds));

      for (const dt of allDeviceTags) {
        const list = tagsMap.get(dt.deviceId) || [];
        list.push(dt.tag);
        tagsMap.set(dt.deviceId, list);
      }
    }

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
        name: d.name || d.sysName || d.ipv4,
        ipv4: d.ipv4,
        status: d.status ?? false,
        macAddress: d.macAddress || d.hikMac,
        sysName: d.sysName,
        sysLocation: d.sysLocation,
        sysDescr: d.sysDescr,
        tags: tagsMap.get(d.id) || [],
        location: d.locationId
          ? {
              id: d.locationId,
              name: d.locationName,
              description: d.locationDescription,
              parentId: d.locationParentId,
            }
          : null,
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
