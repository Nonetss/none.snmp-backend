import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  snmpAuthTable,
  systemTable as deviceSystemTable,
} from '@/db';
import { inArray, eq, sql } from 'drizzle-orm';
import { walkSNMP, sanitizeString } from '@/lib/snmp';
import { logger } from '@/lib/logger';

// Columnas objetivo de la tabla system
const TARGET_COLUMNS = [
  'sysDescr',
  'sysUpTime',
  'sysContact',
  'sysName',
  'sysLocation',
  'sysServices',
] as const;

function formatValue(name: string, value: any): any {
  if (value === null || value === undefined) return null;
  if (Buffer.isBuffer(value)) {
    if (name === 'sysServices') {
      return parseInt(value.toString('utf-8') || '0', 10);
    }
    return sanitizeString(value);
  }
  if (name === 'sysServices') return parseInt(String(value), 10);
  return sanitizeString(value);
}

export async function pollSystem(deviceId?: number) {
  // 1. Obtener definiciones
  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, TARGET_COLUMNS));

  if (metrics.length === 0) {
    logger.warn('[System Poll] No metrics defined for System MIB.');
    return;
  }

  // 2. Obtener dispositivo(s) con select estándar
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
  logger.info(`[System Poll] Processing ${devices.length} devices...`);

  const CONCURRENCY_LIMIT = 10;

  const processDevice = async (device: (typeof devices)[0]) => {
    try {
      const promises = metrics.map(async (metric) => {
        try {
          // Timeout de 2s para polling recurrente
          const result = await walkSNMP(
            device.ipv4,
            device.snmpAuth,
            metric.oidBase,
            2000,
          );
          return { name: metric.name, result };
        } catch (error) {
          return { name: metric.name, result: [] };
        }
      });

      const data = await Promise.all(promises);
      const systemData: Record<string, any> = {};

      for (const { name, result } of data) {
        if (result.length > 0) {
          const varbind = result[0];
          let val = varbind.value;

          if (name === 'sysUpTime') {
            const ticks =
              typeof val === 'number' ? val : parseInt(String(val), 10);
            if (!isNaN(ticks)) {
              const now = new Date();
              const bootTime = new Date(now.getTime() - ticks * 10);
              systemData[name] = bootTime;
              continue;
            }
          }
          systemData[name] = formatValue(name, val);
        }
      }

      if (Object.keys(systemData).length > 0) {
        await db
          .insert(deviceSystemTable)
          .values({
            deviceId: device.id,
            sysDescr: systemData.sysDescr,
            sysUpTime: systemData.sysUpTime,
            sysContact: systemData.sysContact,
            sysName: systemData.sysName,
            sysLocation: systemData.sysLocation,
            sysServices: systemData.sysServices,
          })
          .onConflictDoUpdate({
            target: [deviceSystemTable.deviceId],
            set: {
              sysDescr: sql`EXCLUDED.sys_descr`,
              sysUpTime: sql`EXCLUDED.sys_up_time`,
              sysContact: sql`EXCLUDED.sys_contact`,
              sysName: sql`EXCLUDED.sys_name`,
              sysLocation: sql`EXCLUDED.sys_location`,
              sysServices: sql`EXCLUDED.sys_services`,
            },
          });

        // Actualizar el nombre del dispositivo en la tabla principal
        if (systemData.sysName) {
          await db
            .update(deviceTable)
            .set({ name: systemData.sysName })
            .where(eq(deviceTable.id, device.id));
        }

        logger.info(`[System Poll] ${device.ipv4}: Success`);
      } else {
        logger.info(`[System Poll] ${device.ipv4}: No data`);
      }
    } catch (error) {
      logger.error({ error }, `[System Poll] Error ${device.ipv4}`);
    }
  };

  // Procesar todos los dispositivos en paralelo
  await Promise.all(devices.map(processDevice));
}
