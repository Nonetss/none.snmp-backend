import { db } from '@/core/config';
import { logger } from '@/lib/logger';
import {
  metricObjectsTable,
  deviceTable,
  snmpAuthTable,
  ipSnmpTable,
  ipAddrEntryTable,
  ipNetToMediaTable,
} from '@/db';
import { inArray, eq, sql, and, isNotNull } from 'drizzle-orm';
import { walkSNMP, sanitizeString, normalizeMac } from '@/lib/snmp';
import { chunkArray } from '@/lib/db';

const TARGET_COLUMNS = [
  'ipAdEntAddr',
  'ipAdEntIfIndex',
  'ipAdEntNetMask',
  'ipAdEntBcastAddr',
  'ipAdEntReasmMaxSize',
  'ipNetToMediaIfIndex',
  'ipNetToMediaPhysAddress',
  'ipNetToMediaNetAddress',
  'ipNetToMediaType',
] as const;

function bufferToIp(buf: Buffer): string {
  if (buf.length === 4) return `${buf[0]}.${buf[1]}.${buf[2]}.${buf[3]}`;
  return buf.toString('utf-8');
}

function formatValue(name: string, value: any): any {
  if (value === null || value === undefined) return null;
  const isBuffer = Buffer.isBuffer(value);
  if (
    [
      'ipAdEntAddr',
      'ipAdEntNetMask',
      'ipAdEntBcastAddr',
      'ipNetToMediaNetAddress',
    ].includes(name)
  ) {
    if (isBuffer) return bufferToIp(value);
    return String(value);
  }
  if (name === 'ipNetToMediaPhysAddress') {
    return normalizeMac(value);
  }
  if (
    [
      'ipAdEntIfIndex',
      'ipAdEntReasmMaxSize',
      'ipNetToMediaIfIndex',
      'ipNetToMediaType',
    ].includes(name)
  ) {
    if (isBuffer) return parseInt(value.toString('utf-8') || '0', 10);
    return parseInt(String(value), 10);
  }
  return sanitizeString(value);
}

export async function pollIpSnmp(deviceId?: number) {
  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, TARGET_COLUMNS));

  if (metrics.length === 0) {
    logger.warn('[IP Poll] No metrics defined for IP-MIB.');
    return;
  }

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
  logger.info(`[IP Poll] Processing ${devices.length} devices...`);

  const processDevice = async (device: (typeof devices)[0]) => {
    try {
      await db
        .insert(ipSnmpTable)
        .values({ deviceId: device.id })
        .onConflictDoNothing({ target: [ipSnmpTable.deviceId] });

      const [ipSnmpRecord] = await db
        .select()
        .from(ipSnmpTable)
        .where(eq(ipSnmpTable.deviceId, device.id));

      if (!ipSnmpRecord) return;

      const promises = metrics.map(async (metric) => {
        try {
          const result = await walkSNMP(
            device.ipv4,
            device.snmpAuth,
            metric.oidBase,
            3000,
          );
          return { name: metric.name, result };
        } catch (error) {
          return { name: metric.name, result: [] };
        }
      });

      const data = await Promise.all(promises);
      const ipAddrMap = new Map<string, Record<string, unknown>>();
      const netToMediaMap = new Map<string, Record<string, unknown>>();

      for (const { name, result } of data) {
        const isIpAddr = name.startsWith('ipAdEnt');
        const isNetToMedia = name.startsWith('ipNetToMedia');
        const metricDef = metrics.find((m) => m.name === name);
        if (!metricDef) continue;
        const baseLen = metricDef.oidBase.split('.').length;

        for (const varbind of result) {
          const oidParts = varbind.oid.split('.');
          const indexKey = oidParts.slice(baseLen).join('.');
          if (!indexKey) continue;

          if (isIpAddr) {
            if (!ipAddrMap.has(indexKey)) ipAddrMap.set(indexKey, {});
            ipAddrMap.get(indexKey)![name] = formatValue(name, varbind.value);
          } else if (isNetToMedia) {
            if (!netToMediaMap.has(indexKey)) netToMediaMap.set(indexKey, {});
            netToMediaMap.get(indexKey)![name] = formatValue(
              name,
              varbind.value,
            );
          }
        }
      }

      const timestamp = new Date();

      // --- IP ADDR TABLE ---
      const ipList = Array.from(ipAddrMap.values()).filter(
        (row) => row.ipAdEntAddr,
      );
      if (ipList.length > 0) {
        const entries = ipList.map((row: any) => ({
          ipSnmpId: ipSnmpRecord.id,
          time: timestamp,
          ipAdEntAddr: row.ipAdEntAddr,
          ipAdEntIfIndex: Number(row.ipAdEntIfIndex) || 0,
          ipAdEntNetMask: row.ipAdEntNetMask || '',
          ipAdEntBcastAddr: row.ipAdEntBcastAddr || '',
          ipAdEntReasmMaxSize: Number(row.ipAdEntReasmMaxSize) || 0,
        }));

        for (const chunk of chunkArray(entries, 1000)) {
          await db
            .insert(ipAddrEntryTable)
            .values(chunk)
            .onConflictDoUpdate({
              target: [ipAddrEntryTable.ipSnmpId, ipAddrEntryTable.ipAdEntAddr],
              set: {
                time: timestamp,
                ipAdEntIfIndex: sql`EXCLUDED.ip_ad_ent_if_index`,
                ipAdEntNetMask: sql`EXCLUDED.ip_ad_ent_net_mask`,
                ipAdEntBcastAddr: sql`EXCLUDED.ip_ad_ent_bcast_addr`,
                ipAdEntReasmMaxSize: sql`EXCLUDED.ip_ad_ent_reasm_max_size`,
              },
            });
        }
      }

      // --- NET TO MEDIA TABLE (ARP) ---
      const netListRaw = Array.from(netToMediaMap.values());
      // Filtrar entradas sin IP o sin ifIndex que causarían conflictos
      const finalNetEntries = new Map<string, any>();

      for (const row of netListRaw) {
        const ifIdx = Number(row.ipNetToMediaIfIndex);
        const netAddr = row.ipNetToMediaNetAddress?.toString();

        if (!ifIdx || !netAddr || netAddr === '0.0.0.0') continue;

        const key = `${ifIdx}_${netAddr}`;
        // En caso de duplicados en el Map (que no deberían ocurrir por indexKey, pero por si acaso)
        // priorizamos entradas con MAC
        if (
          !finalNetEntries.has(key) ||
          (!finalNetEntries.get(key).ipNetToMediaPhysAddress &&
            row.ipNetToMediaPhysAddress)
        ) {
          finalNetEntries.set(key, {
            ipSnmpId: ipSnmpRecord.id,
            time: timestamp,
            ipNetToMediaIfIndex: ifIdx,
            ipNetToMediaPhysAddress: row.ipNetToMediaPhysAddress || '',
            ipNetToMediaNetAddress: netAddr,
            ipNetToMediaType: Number(row.ipNetToMediaType) || 0,
          });
        }
      }

      const netList = Array.from(finalNetEntries.values());

      if (netList.length > 0) {
        for (const chunk of chunkArray(netList, 1000)) {
          await db
            .insert(ipNetToMediaTable)
            .values(chunk)
            .onConflictDoUpdate({
              target: [
                ipNetToMediaTable.ipSnmpId,
                ipNetToMediaTable.ipNetToMediaIfIndex,
                ipNetToMediaTable.ipNetToMediaNetAddress,
              ],
              set: {
                time: timestamp,
                ipNetToMediaPhysAddress: sql`EXCLUDED.ip_net_to_media_phys_address`,
                ipNetToMediaType: sql`EXCLUDED.ip_net_to_media_type`,
              },
            });
        }
      }

      logger.info(`[IP Poll] ${device.ipv4}: Success`);
    } catch (error) {
      logger.error({ error }, `[IP Poll] Error ${device.ipv4}`);
    }
  };

  // Procesar todos los dispositivos en paralelo
  await Promise.all(devices.map(processDevice));
}
