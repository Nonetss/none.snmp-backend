import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  snmpAuthTable,
  entityPhysicalTable,
} from '@/db';
import { inArray, eq, sql } from 'drizzle-orm';
import { walkSNMP, sanitizeString } from '@/lib/snmp';
import { chunkArray } from '@/lib/db';
import { logger } from '@/lib/logger';

const ENTITY_METRICS = [
  'entPhysicalDescr',
  'entPhysicalVendorType',
  'entPhysicalContainedIn',
  'entPhysicalClass',
  'entPhysicalParentRelPos',
  'entPhysicalName',
  'entPhysicalHardwareRev',
  'entPhysicalFirmwareRev',
  'entPhysicalSoftwareRev',
  'entPhysicalSerialNum',
  'entPhysicalMfgName',
  'entPhysicalModelName',
  'entPhysicalAlias',
  'entPhysicalAssetID',
  'entPhysicalIsFRU',
  'entPhysicalMfgDate',
] as const;

function parseSnmpDate(buffer: Buffer): Date | null {
  if (buffer.length < 8) return null;
  try {
    const year = (buffer[0] << 8) | buffer[1];
    const month = buffer[2];
    const day = buffer[3];
    const hour = buffer[4];
    const minute = buffer[5];
    const second = buffer[6];
    return new Date(year, month - 1, day, hour, minute, second);
  } catch {
    return null;
  }
}

function formatValue(name: string, value: any): any {
  if (value === null || value === undefined) return null;

  if (Buffer.isBuffer(value)) {
    if (name === 'entPhysicalMfgDate') {
      return parseSnmpDate(value);
    }
    return sanitizeString(value);
  }

  if (
    [
      'entPhysicalContainedIn',
      'entPhysicalClass',
      'entPhysicalParentRelPos',
      'entPhysicalIsFRU',
    ].includes(name)
  ) {
    return parseInt(String(value), 10);
  }

  return sanitizeString(value);
}

export async function pollEntity(deviceId?: number) {
  // 1. Obtener definiciones de métricas
  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, Array.from(ENTITY_METRICS)));

  if (metrics.length === 0) {
    logger.warn('[Entity Poll] No metrics defined for ENTITY-MIB.');
    return;
  }

  // 2. Obtener dispositivo(s)
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
  logger.info(`[Entity Poll] Processing ${devices.length} devices...`);

  const CONCURRENCY_LIMIT = 5;

  const processDevice = async (device: (typeof devices)[0]) => {
    try {
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

      const entityMap = new Map<number, any>();

      for (const { name, result, baseOid } of data) {
        const baseLen = baseOid.split('.').length;
        for (const varbind of result) {
          const parts = varbind.oid.split('.');
          const physicalIndex = parseInt(parts[parts.length - 1], 10);

          if (isNaN(physicalIndex)) continue;

          if (!entityMap.has(physicalIndex)) {
            entityMap.set(physicalIndex, {
              physicalIndex: physicalIndex,
            });
          }

          entityMap.get(physicalIndex)[name] = formatValue(name, varbind.value);
        }
      }

      const entityEntries = Array.from(entityMap.values());

      if (entityEntries.length > 0) {
        const valuesToInsert = entityEntries.map((e) => ({
          deviceId: device.id,

          physicalIndex: e.physicalIndex,

          descr: e.entPhysicalDescr,

          vendorType: e.entPhysicalVendorType,

          containedIn: e.entPhysicalContainedIn,

          class: e.entPhysicalClass,

          parentRelPos: e.entPhysicalParentRelPos,

          name: e.entPhysicalName,

          hardwareRev: e.entPhysicalHardwareRev,

          firmwareRev: e.entPhysicalFirmwareRev,

          softwareRev: e.entPhysicalSoftwareRev,

          serialNum: e.entPhysicalSerialNum,

          mfgName: e.entPhysicalMfgName,

          modelName: e.entPhysicalModelName,

          alias: e.entPhysicalAlias,

          assetId: e.entPhysicalAssetID,

          isFru: e.entPhysicalIsFRU,

          mfgDate: e.entPhysicalMfgDate,
        }));

        for (const chunk of chunkArray(valuesToInsert, 1000)) {
          await db

            .insert(entityPhysicalTable)

            .values(chunk)

            .onConflictDoUpdate({
              target: [
                entityPhysicalTable.deviceId,

                entityPhysicalTable.physicalIndex,
              ],

              set: {
                descr: sql`EXCLUDED.descr`,

                vendorType: sql`EXCLUDED.vendor_type`,

                containedIn: sql`EXCLUDED.contained_in`,

                class: sql`EXCLUDED.class`,

                parentRelPos: sql`EXCLUDED.parent_rel_pos`,

                name: sql`EXCLUDED.name`,

                hardwareRev: sql`EXCLUDED.hardware_rev`,

                firmwareRev: sql`EXCLUDED.firmware_rev`,

                softwareRev: sql`EXCLUDED.software_rev`,

                serialNum: sql`EXCLUDED.serial_num`,

                mfgName: sql`EXCLUDED.mfg_name`,

                modelName: sql`EXCLUDED.model_name`,

                alias: sql`EXCLUDED.alias`,

                assetId: sql`EXCLUDED.asset_id`,

                isFru: sql`EXCLUDED.is_fru`,

                mfgDate: sql`EXCLUDED.mfg_date`,

                updatedAt: new Date(),
              },
            });
        }

        logger.info(
          `[Entity Poll] ${device.ipv4}: Success (${entityEntries.length} entities)`,
        );
      } else {
        logger.info(`[Entity Poll] ${device.ipv4}: No entities found`);
      }
    } catch (error) {
      logger.error({ error }, `[Entity Poll] Error ${device.ipv4}`);
    }
  };

  // Procesar todos los dispositivos en paralelo
  await Promise.all(devices.map(processDevice));
}
