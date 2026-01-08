import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  interfaceTable,
  snmpAuthTable,
  cdpNeighborTable,
} from '@/db';
import { inArray, eq, sql } from 'drizzle-orm';
import { walkSNMP, sanitizeString, normalizeMac } from '@/lib/snmp';
import { chunkArray } from '@/lib/db';
import { logger } from '@/lib/logger';

const CDP_METRICS = [
  'cdpCacheAddress',
  'cdpCacheDeviceId',
  'cdpCacheDevicePort',
  'cdpCachePlatform',
  'cdpCacheCapabilities',
  'cdpCacheSysName',
] as const;

function formatValue(name: string, value: any): any {
  if (value === null || value === undefined) return null;

  if (Buffer.isBuffer(value)) {
    // 1. Dirección IPv4
    if (name === 'cdpCacheAddress' && value.length === 4) {
      return `${value[0]}.${value[1]}.${value[2]}.${value[3]}`;
    }

    // 2. Capacidades (Bits/Octet String)
    if (name === 'cdpCacheCapabilities') {
      return value.toString('hex').toUpperCase();
    }

    // 3. MAC Binaria (6 bytes)
    if (value.length === 6) {
      const isPrintable = value.every((b) => b >= 32 && b <= 126);
      if (!isPrintable) {
        return normalizeMac(value);
      }
    }
  }

  const strValue = sanitizeString(value).trim();

  // 4. Normalizar MACs que vienen como String
  const normalized = normalizeMac(strValue);
  if (normalized && normalized.includes(':')) {
    return normalized;
  }

  return strValue.replace(/[^\x20-\x7E]/g, '');
}

export async function pollCdp(deviceId?: number) {
  // 1. Obtener definiciones de métricas
  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, Array.from(CDP_METRICS)));

  if (metrics.length === 0) {
    logger.warn('[CDP Poll] No metrics defined for CISCO-CDP-MIB.');
    return;
  }

  // 2. Cache para resolución de topología
  const allDevices = await db.select().from(deviceTable);
  const deviceIpMap = new Map(allDevices.map((d) => [d.ipv4, d.id]));
  const deviceNameMap = new Map(
    allDevices
      .filter((d) => d.name)
      .map((d) => [d.name!.toLowerCase().split('.')[0], d.id]),
  );

  const allInterfaces = await db.select().from(interfaceTable);
  const deviceInterfacesMap = new Map<number, (typeof allInterfaces)[0][]>();

  for (const iface of allInterfaces) {
    const list = deviceInterfacesMap.get(iface.deviceId) || [];
    list.push(iface);
    deviceInterfacesMap.set(iface.deviceId, list);
  }

  // 3. Obtener dispositivo(s)
  const query = db
    .select({
      id: deviceTable.id,
      ipv4: deviceTable.ipv4,
      snmpAuth: snmpAuthTable,
    })
    .from(deviceTable)
    .innerJoin(snmpAuthTable, eq(deviceTable.snmpAuthId, snmpAuthTable.id));

  if (deviceId) {
    query.where(eq(deviceTable.id, deviceId));
  }

  const devices = await query;
  logger.info(`[CDP Poll] Processing ${devices.length} devices...`);

  const processDevice = async (device: (typeof devices)[0]) => {
    try {
      const currentDeviceInterfaces = deviceInterfacesMap.get(device.id) || [];
      const ifIndexMap = new Map(
        currentDeviceInterfaces.map((i) => [i.ifIndex, i.id]),
      );

      const promises = metrics.map(async (metric) => {
        try {
          const result = await walkSNMP(
            device.ipv4,
            device.snmpAuth,
            metric.oidBase,
            3000,
          );
          return { name: metric.name, result, baseOid: metric.oidBase };
        } catch (error) {
          return { name: metric.name, result: [], baseOid: metric.oidBase };
        }
      });

      const data = await Promise.all(promises);

      // Index key: ifIndex.deviceIndex
      const neighborsMap = new Map<string, any>();

      for (const { name, result, baseOid } of data) {
        const baseLen = baseOid.split('.').length;
        for (const varbind of result) {
          const parts = varbind.oid.split('.');
          const indexKey = parts.slice(baseLen).join('.'); // ifIndex.deviceIndex

          if (!neighborsMap.has(indexKey)) {
            const indexParts = indexKey.split('.');
            neighborsMap.set(indexKey, {
              ifIndex: parseInt(indexParts[0], 10),
              neighborIndex: parseInt(indexParts[1], 10),
            });
          }

          neighborsMap.get(indexKey)[name] = formatValue(name, varbind.value);
        }
      }

      const neighborEntries = Array.from(neighborsMap.values());

      if (neighborEntries.length > 0) {
        const valuesToInsert = neighborEntries
          .map((n) => {
            // --- ESTRATEGIA DE RESOLUCIÓN AGRESIVA ---
            let remoteDeviceId: number | null = null;

            const cleanName = (s: string | null) =>
              s ? s.toLowerCase().split('.')[0] : null;

            // 1. Por IP (cdpCacheAddress)
            if (n.cdpCacheAddress && deviceIpMap.has(n.cdpCacheAddress)) {
              remoteDeviceId = deviceIpMap.get(n.cdpCacheAddress)!;
            }

            // 2. Por Nombre (SysName o DeviceId)
            if (!remoteDeviceId) {
              const nameToTry =
                cleanName(n.cdpCacheSysName) || cleanName(n.cdpCacheDeviceId);
              if (nameToTry && deviceNameMap.has(nameToTry)) {
                remoteDeviceId = deviceNameMap.get(nameToTry)!;
              }
            }

            // 3. Intentar resolver remoteInterfaceId si tenemos el dispositivo
            let remoteInterfaceId: number | null = null;
            if (remoteDeviceId && n.cdpCacheDevicePort) {
              const remoteIfaces =
                deviceInterfacesMap.get(remoteDeviceId) || [];
              const pName = n.cdpCacheDevicePort.toUpperCase();

              const found = remoteIfaces.find(
                (i) =>
                  i.ifName?.toUpperCase() === pName ||
                  i.ifDescr?.toUpperCase() === pName ||
                  String(i.ifIndex) === pName,
              );
              if (found) remoteInterfaceId = found.id;
            }

            const interfaceId = ifIndexMap.get(n.ifIndex);
            if (!interfaceId) {
              logger.warn(
                `[CDP Poll] ${device.ipv4}: Could not map ifIndex ${n.ifIndex} to any interfaceId. Skipping neighbor.`,
              );
              return null;
            }

            return {
              deviceId: device.id,
              interfaceId: interfaceId,
              cdpCacheAddress: n.cdpCacheAddress,
              cdpCacheDeviceId: n.cdpCacheDeviceId,
              cdpCacheDevicePort: n.cdpCacheDevicePort,
              cdpCachePlatform: n.cdpCachePlatform,
              cdpCacheCapabilities: n.cdpCacheCapabilities,
              cdpCacheSysName: n.cdpCacheSysName,
              remoteDeviceId,
              remoteInterfaceId,
            };
          })
          .filter((v): v is NonNullable<typeof v> => v !== null);

        // --- DEDUPLICACIÓN POR INTERFACE_ID ---
        const deduplicatedMap = new Map<number, (typeof valuesToInsert)[0]>();
        for (const val of valuesToInsert) {
          const existing = deduplicatedMap.get(val.interfaceId);
          if (!existing || (val.remoteDeviceId && !existing.remoteDeviceId)) {
            deduplicatedMap.set(val.interfaceId, val);
          }
        }
        const finalValues = Array.from(deduplicatedMap.values());

        if (finalValues.length === 0) return;

        try {
          for (const chunk of chunkArray(finalValues, 1000)) {
            await db
              .insert(cdpNeighborTable)
              .values(chunk)
              .onConflictDoUpdate({
                target: [
                  cdpNeighborTable.deviceId,
                  cdpNeighborTable.interfaceId,
                ],
                set: {
                  cdpCacheAddress: sql`EXCLUDED.cdp_cache_address`,
                  cdpCacheDeviceId: sql`EXCLUDED.cdp_cache_device_id`,
                  cdpCacheDevicePort: sql`EXCLUDED.cdp_cache_device_port`,
                  cdpCachePlatform: sql`EXCLUDED.cdp_cache_platform`,
                  cdpCacheCapabilities: sql`EXCLUDED.cdp_cache_capabilities`,
                  cdpCacheSysName: sql`EXCLUDED.cdp_cache_sys_name`,
                  remoteDeviceId: sql`EXCLUDED.remote_device_id`,
                  remoteInterfaceId: sql`EXCLUDED.remote_interface_id`,
                  updatedAt: new Date(),
                },
              });
          }
          logger.info(
            `[CDP Poll] ${device.ipv4}: Successfully saved ${finalValues.length} neighbors`,
          );
        } catch (dbError) {
          logger.error(
            { dbError },
            `[CDP Poll] ${device.ipv4}: Error during database insertion`,
          );
        }
      } else {
        logger.info(`[CDP Poll] ${device.ipv4}: No CDP neighbors found`);
      }
    } catch (error) {
      logger.error({ error }, `[CDP Poll] Error ${device.ipv4}`);
    }
  };

  await Promise.all(devices.map(processDevice));
}
