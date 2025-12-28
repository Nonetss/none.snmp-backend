import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  snmpAuthTable,
  ipSnmpTable,
  ipAddrEntryTable,
  ipNetToMediaTable,
} from '@/db';
import { inArray, eq, sql } from 'drizzle-orm';
import { walkSNMP } from '@/lib/snmp';

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

function bufferToMac(buf: Buffer): string {
  if (buf.length === 0) return '';
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(':');
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
    if (isBuffer) return bufferToMac(value);
    return String(value);
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
  if (isBuffer) return value.toString('utf-8');
  return String(value);
}

export async function pollIpSnmp(deviceId?: number) {
  console.time('pollIpSnmp');

  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, TARGET_COLUMNS));

  if (metrics.length === 0) {
    console.warn('[IP Poll] No metrics defined for IP-MIB.');
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

  for (const device of devices) {
    try {
      await db
        .insert(ipSnmpTable)
        .values({ deviceId: device.id })
        .onConflictDoNothing({ target: [ipSnmpTable.deviceId] });

      const [ipSnmpRecord] = await db
        .select()
        .from(ipSnmpTable)
        .where(eq(ipSnmpTable.deviceId, device.id));

      if (!ipSnmpRecord) continue;

      const promises = metrics.map(async (metric) => {
        try {
          const result = await walkSNMP(
            device.ipv4,
            device.snmpAuth,
            metric.oidBase,
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

      const ipList = Array.from(ipAddrMap.values());
      const netList = Array.from(netToMediaMap.values());
      const timestamp = new Date();

      if (ipList.length > 0) {
        const entries = ipList.map((row: any) => ({
          ipSnmpId: ipSnmpRecord.id,
          time: timestamp,
          ipAdEntAddr: row.ipAdEntAddr || '',
          ipAdEntIfIndex: Number(row.ipAdEntIfIndex) || 0,
          ipAdEntNetMask: row.ipAdEntNetMask || '',
          ipAdEntBcastAddr: row.ipAdEntBcastAddr || '',
          ipAdEntReasmMaxSize: Number(row.ipAdEntReasmMaxSize) || 0,
        }));

        await db
          .insert(ipAddrEntryTable)
          .values(entries)
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

      if (netList.length > 0) {
        const entries = netList.map((row: any) => ({
          ipSnmpId: ipSnmpRecord.id,
          time: timestamp,
          ipAdEntAddr: row.ipAdEntAddr || '', // No usado aquí pero por si acaso
          ipNetToMediaIfIndex: Number(row.ipNetToMediaIfIndex) || 0,
          ipNetToMediaPhysAddress: row.ipNetToMediaPhysAddress || '',
          ipNetToMediaNetAddress: row.ipNetToMediaNetAddress || '',
          ipNetToMediaType: Number(row.ipNetToMediaType) || 0,
        }));

        await db
          .insert(ipNetToMediaTable)
          .values(entries.map(({ ipAdEntAddr, ...rest }) => rest))
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

      console.log(`[IP Poll] ${device.ipv4}: Procesado correctamente.`);
    } catch (error) {
      console.error(`Error procesando IP SNMP de ${device.ipv4}:`, error);
    }
  }

  console.timeEnd('pollIpSnmp');
}
