import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  snmpAuthTable,
  resourceTable,
  hrSWRunEntryTable,
  hrSWRunPerfEntryTable,
  hrSWInstalledEntryTable,
} from '@/db';
import { inArray, eq, sql, and } from 'drizzle-orm';
import { walkSNMP, sanitizeString } from '@/lib/snmp';
import { chunkArray } from '@/lib/db';
import { logger } from '@/lib/logger';

const TARGET_COLUMNS = [
  'hrSWRunIndex',
  'hrSWRunName',
  'hrSWRunID',
  'hrSWRunPath',
  'hrSWRunParameters',
  'hrSWRunType',
  'hrSWRunStatus',
  'hrSWRunPerfCPU',
  'hrSWRunPerfMem',
  'hrSWInstalledIndex',
  'hrSWInstalledName',
  'hrSWInstalledID',
  'hrSWInstalledType',
  'hrSWInstalledDate',
] as const;

function parseSnmpDate(buffer: Buffer): Date {
  if (buffer.length < 8) return new Date();
  const year = (buffer[0] << 8) | buffer[1];
  const month = buffer[2];
  const day = buffer[3];
  const hour = buffer[4];
  const minute = buffer[5];
  const second = buffer[6];
  return new Date(year, month - 1, day, hour, minute, second);
}

function formatValue(name: string, value: any): any {
  if (value === null || value === undefined) return null;
  if (Buffer.isBuffer(value)) {
    if (name === 'hrSWInstalledDate') {
      try {
        return parseSnmpDate(value);
      } catch {
        return new Date();
      }
    }
    if (
      [
        'hrSWRunIndex',
        'hrSWRunType',
        'hrSWRunStatus',
        'hrSWRunPerfCPU',
        'hrSWRunPerfMem',
        'hrSWInstalledIndex',
        'hrSWInstalledType',
      ].includes(name)
    ) {
      return parseInt(value.toString('utf-8') || '0', 10);
    }
    return sanitizeString(value);
  }
  if (name === 'hrSWInstalledDate') return new Date(String(value));
  if (
    [
      'hrSWRunIndex',
      'hrSWRunType',
      'hrSWRunStatus',
      'hrSWRunPerfCPU',
      'hrSWRunPerfMem',
      'hrSWInstalledIndex',
      'hrSWInstalledType',
    ].includes(name)
  ) {
    return parseInt(String(value), 10);
  }
  return sanitizeString(value);
}

export async function pollResources(deviceId?: number) {
  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, TARGET_COLUMNS));

  if (metrics.length === 0) {
    logger.warn('[Resource Poll] No metrics defined for HR-SW.');
    return;
  }

  // Usamos select estándar con join para evitar errores relacionales
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
  logger.info(`[Resource Poll] Processing ${devices.length} devices...`);

  const CONCURRENCY_LIMIT = 5;

  const processDevice = async (device: (typeof devices)[0]) => {
    try {
      // 1. Asegurar registro padre en resourceTable
      await db
        .insert(resourceTable)
        .values({
          deviceId: device.id,
          name: 'Host Resources',
          type: 'SNMP_HR',
          value: 'Software & Processes',
        })
        .onConflictDoNothing({
          target: [
            resourceTable.deviceId,
            resourceTable.name,
            resourceTable.type,
          ],
        });

      const [hrResource] = await db
        .select()
        .from(resourceTable)
        .where(
          and(
            eq(resourceTable.deviceId, device.id),
            eq(resourceTable.name, 'Host Resources'),
            eq(resourceTable.type, 'SNMP_HR'),
          ),
        );

      if (!hrResource) return;

      // 2. Obtener datos SNMP
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

      const runMap = new Map<number, Record<string, unknown>>();
      const installedMap = new Map<number, Record<string, unknown>>();

      for (const { name, result } of data) {
        const isRun = name.startsWith('hrSWRun');
        const isInstalled = name.startsWith('hrSWInstalled');

        for (const varbind of result) {
          const oidParts = varbind.oid.split('.');
          const idx = parseInt(oidParts[oidParts.length - 1], 10);
          if (isNaN(idx)) continue;

          if (isRun) {
            if (!runMap.has(idx)) runMap.set(idx, { hrSWRunIndex: idx });
            runMap.get(idx)![name] = formatValue(name, varbind.value);
          } else if (isInstalled) {
            if (!installedMap.has(idx))
              installedMap.set(idx, { hrSWInstalledIndex: idx });
            installedMap.get(idx)![name] = formatValue(name, varbind.value);
          }
        }
      }

      const runList = Array.from(runMap.values());
      const installedList = Array.from(installedMap.values());
      const timestamp = new Date();

      // 3. Inserción de datos
      if (runList.length > 0) {
        const runEntries = runList.map((p: any) => ({
          resourceId: hrResource.id,
          date: timestamp,
          hrSWRunIndex: p.hrSWRunIndex,
          hrSWRunName: p.hrSWRunName || '',
          hrSWRunID: p.hrSWRunID || '0.0',
          hrSWRunPath: p.hrSWRunPath || '',
          hrSWRunParameters: p.hrSWRunParameters || '',
          hrSWRunType: Number(p.hrSWRunType) || 0,
          hrSWRunStatus: Number(p.hrSWRunStatus) || 0,
        }));

        for (const chunk of chunkArray(runEntries, 1000)) {
          await db.insert(hrSWRunEntryTable).values(chunk);
        }

        const perfEntries = runList
          .filter(
            (p: any) =>
              p.hrSWRunPerfCPU !== undefined || p.hrSWRunPerfMem !== undefined,
          )
          .map((p: any) => ({
            resourceId: hrResource.id,
            date: timestamp,
            hrSWRunIndex: p.hrSWRunIndex,
            hrSWRunPerfCPU: Number(p.hrSWRunPerfCPU) || 0,
            hrSWRunPerfMem: Number(p.hrSWRunPerfMem) || 0,
          }));

        if (perfEntries.length > 0) {
          for (const chunk of chunkArray(perfEntries, 1000)) {
            await db.insert(hrSWRunPerfEntryTable).values(chunk);
          }
        }
      }

      if (installedList.length > 0) {
        const uniqueInstalledMap = new Map<string, any>();

        installedList.forEach((p: any) => {
          const name = p.hrSWInstalledName || '';
          const entry = {
            resourceId: hrResource.id,
            date: timestamp,
            hrSWInstalledIndex: p.hrSWInstalledIndex,
            hrSWInstalledName: name,
            hrSWInstalledID: p.hrSWInstalledID || '0.0',
            hrSWInstalledType: Number(p.hrSWInstalledType) || 0,
            hrSWInstalledDate:
              p.hrSWInstalledDate instanceof Date
                ? p.hrSWInstalledDate
                : new Date(),
          };
          uniqueInstalledMap.set(name, entry);
        });

        const installedEntries = Array.from(uniqueInstalledMap.values());

        for (const chunk of chunkArray(installedEntries, 1000)) {
          await db
            .insert(hrSWInstalledEntryTable)
            .values(chunk)
            .onConflictDoUpdate({
              target: [
                hrSWInstalledEntryTable.resourceId,
                hrSWInstalledEntryTable.hrSWInstalledName,
              ],
              set: {
                hrSWInstalledIndex: sql.raw('EXCLUDED.hr_sw_installed_index'),
                hrSWInstalledID: sql.raw('EXCLUDED.hr_sw_installed_id'),
                hrSWInstalledType: sql.raw('EXCLUDED.hr_sw_installed_type'),
                hrSWInstalledDate: sql.raw('EXCLUDED.hr_sw_installed_date'),
                date: new Date(),
              },
            });
        }
      }

      logger.info(`[Resource Poll] ${device.ipv4}: Success`);
    } catch (error) {
      logger.error({ error }, `[Resource Poll] Error ${device.ipv4}`);
    }
  };

  // Procesar todos los dispositivos en paralelo
  await Promise.all(devices.map(processDevice));
}
