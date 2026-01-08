import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  interfaceTable,
  snmpAuthTable,
  lldpNeighborTable,
} from '@/db';
import { inArray, eq, sql } from 'drizzle-orm';
import { walkSNMP, sanitizeString, normalizeMac } from '@/lib/snmp';
import { chunkArray } from '@/lib/db';
import { logger } from '@/lib/logger';

const LLDP_METRICS = [
  'lldpRemChassisIdSubtype',
  'lldpRemChassisId',
  'lldpRemPortIdSubtype',
  'lldpRemPortId',
  'lldpRemPortDesc',
  'lldpRemSysName',
  'lldpRemSysDesc',
  'lldpRemSysCapSupported',
  'lldpRemSysCapEnabled',
  'lldpRemManAddrIfSubtype',
] as const;

function formatValue(name: string, value: any): any {
  if (value === null || value === undefined) return null;

  // Subtipos y campos numéricos
  if (
    name.endsWith('Subtype') ||
    name.endsWith('Index') ||
    name.endsWith('Num')
  ) {
    return parseInt(String(value), 10);
  }

  // Detectar si puede ser una MAC (basado en ChassisIdSubtype o PortIdSubtype)
  // Subtype 4 para ChassisId y 3 para PortId suelen ser MAC addresses
  // Pero lo intentamos normalizar si parece una MAC de todas formas
  if (name === 'lldpRemChassisId' || name === 'lldpRemPortId') {
    const normalized = normalizeMac(value);
    if (normalized && normalized.includes(':')) {
      return normalized;
    }
  }

  if (Buffer.isBuffer(value)) {
    // 1. Caso binario (6 bytes)
    if (value.length === 6) {
      const isPrintable = value.every((b) => b >= 32 && b <= 126);
      if (!isPrintable) {
        return normalizeMac(value);
      }
    }

    // 2. Caso binario genérico (Bits de capacidades)
    if (name === 'lldpRemSysCapSupported' || name === 'lldpRemSysCapEnabled') {
      return value.toString('hex').toUpperCase();
    }
  }

  const strValue = sanitizeString(value).trim();

  // 3. Normalizar MACs que vienen como String
  const normalized = normalizeMac(strValue);
  if (normalized && normalized.includes(':')) {
    return normalized;
  }

  return strValue.replace(/[^\x20-\x7E]/g, '');
}

/**
 * Extrae la dirección de gestión del índice de SNMP.
 * lldpRemManAddrTable index: [timeMark, localPortNum, neighborIndex, subtype, length, ...address]
 */
function parseMgmtAddress(indexParts: string[]): string | null {
  if (indexParts.length < 5) return null;
  const subtype = parseInt(indexParts[3], 10);
  const len = parseInt(indexParts[4], 10);
  const addrParts = indexParts.slice(5, 5 + len);

  if (subtype === 1 && len === 4) {
    // IPv4
    return addrParts.join('.');
  }
  return null;
}

export async function pollLldp(deviceId?: number) {
  // 1. Obtener definiciones de métricas
  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, Array.from(LLDP_METRICS)));

  if (metrics.length === 0) {
    logger.warn('[LLDP Poll] No metrics defined for LLDP-MIB.');
    return;
  }

  // 2. Cache para resolución de topología
  const allDevices = await db.select().from(deviceTable);
  const deviceIpMap = new Map(allDevices.map((d) => [d.ipv4, d.id]));
  // Mapa de Nombre (normalizado) -> deviceId
  const deviceNameMap = new Map(
    allDevices
      .filter((d) => d.name)
      .map((d) => [d.name!.toLowerCase().split('.')[0], d.id]),
  );

  const allInterfaces = await db.select().from(interfaceTable);
  // Mapa de MAC -> deviceId para resolver dispositivos por Chassis ID o Port ID
  const interfaceMacMap = new Map<string, number>();
  // Mapa de deviceId -> [interfaces] para resolver la interfaz remota exacta
  const deviceInterfacesMap = new Map<number, (typeof allInterfaces)[0][]>();

  for (const iface of allInterfaces) {
    if (iface.ifPhysAddress) {
      interfaceMacMap.set(iface.ifPhysAddress.toUpperCase(), iface.deviceId);
    }
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
  logger.info(`[LLDP Poll] Processing ${devices.length} devices...`);

  const processDevice = async (device: (typeof devices)[0]) => {
    try {
      // Interfaces locales del dispositivo actual para mapear interfaceId
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
      const neighborsMap = new Map<string, any>();

      for (const { name, result, baseOid } of data) {
        const baseLen = baseOid.split('.').length;
        for (const varbind of result) {
          const parts = varbind.oid.split('.');
          const indexParts = parts.slice(baseLen);

          if (indexParts.length < 3) continue;

          // localPortNum.neighborIndex
          const indexKey = `${indexParts[1]}.${indexParts[2]}`;

          if (!neighborsMap.has(indexKey)) {
            neighborsMap.set(indexKey, {
              localPortNum: parseInt(indexParts[1], 10),
              neighborIndex: parseInt(indexParts[2], 10),
              mgmtAddress: null,
            });
          }

          const neighbor = neighborsMap.get(indexKey);

          if (name === 'lldpRemManAddrIfSubtype') {
            const ip = parseMgmtAddress(indexParts);
            if (ip) neighbor.mgmtAddress = ip;
          } else {
            neighbor[name] = formatValue(name, varbind.value);
          }
        }
      }

      const neighborEntries = Array.from(neighborsMap.values());
      logger.info(
        `[LLDP Poll] ${device.ipv4}: Found ${neighborEntries.length} neighbors in SNMP`,
      );

      if (neighborEntries.length > 0) {
        const valuesToInsert = neighborEntries
          .map((n) => {
            // --- ESTRATEGIA DE RESOLUCIÓN AGRESIVA ---
            let remoteDeviceId: number | null = null;

            const cleanName = (s: string | null) =>
              s ? s.toLowerCase().split('.')[0] : null;

            // 1. Por IP de Gestión
            if (n.mgmtAddress && deviceIpMap.has(n.mgmtAddress)) {
              remoteDeviceId = deviceIpMap.get(n.mgmtAddress)!;
            }

            // 2. Por MAC de Chasis (Subtype 4)
            if (
              !remoteDeviceId &&
              n.lldpRemChassisIdSubtype === 4 &&
              n.lldpRemChassisId
            ) {
              remoteDeviceId = interfaceMacMap.get(
                n.lldpRemChassisId.toUpperCase(),
              );
            }

            // 3. Por MAC de Puerto (A veces el puerto anuncia la MAC del equipo)
            if (
              !remoteDeviceId &&
              n.lldpRemPortId &&
              /^[0-9A-F:]{17}$/i.test(n.lldpRemPortId)
            ) {
              remoteDeviceId = interfaceMacMap.get(
                n.lldpRemPortId.toUpperCase(),
              );
            }

            // 4. Por Nombre de Sistema
            if (!remoteDeviceId) {
              const nameToTry =
                cleanName(n.lldpRemSysName) || cleanName(n.lldpRemChassisId);
              if (nameToTry && deviceNameMap.has(nameToTry)) {
                remoteDeviceId = deviceNameMap.get(nameToTry)!;
              }
            }

            // 2. Intentar resolver remoteInterfaceId si tenemos el dispositivo
            let remoteInterfaceId: number | null = null;
            if (remoteDeviceId && n.lldpRemPortId) {
              const remoteIfaces =
                deviceInterfacesMap.get(remoteDeviceId) || [];
              const pId = n.lldpRemPortId.toUpperCase();

              const found = remoteIfaces.find((i) => {
                const ifMac = i.ifPhysAddress?.toUpperCase();

                // Si el portId es una MAC (formateada por formatValue), prioridad absoluta a la MAC
                if (/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/i.test(pId)) {
                  if (ifMac === pId) return true;
                }

                // Si no, buscamos por Nombre, Descripción o Índice
                return (
                  i.ifName?.toUpperCase() === pId ||
                  i.ifDescr?.toUpperCase() === pId ||
                  String(i.ifIndex) === pId
                );
              });
              if (found) remoteInterfaceId = found.id;
            }

            const interfaceId = ifIndexMap.get(n.localPortNum);
            if (!interfaceId) {
              logger.warn(
                `[LLDP Poll] ${device.ipv4}: Could not map localPortNum ${n.localPortNum} to any interfaceId. Skipping neighbor.`,
              );
              return null;
            }

            return {
              deviceId: device.id,
              interfaceId: interfaceId,
              lldpRemChassisId: n.lldpRemChassisId,
              lldpRemPortIdSubtype: n.lldpRemPortIdSubtype,
              lldpRemPortId: n.lldpRemPortId,
              lldpRemSysName: n.lldpRemSysName,
              remoteDeviceId,
              remoteInterfaceId,
            };
          })
          .filter((v): v is NonNullable<typeof v> => v !== null);

        // --- DEDUPLICACIÓN POR INTERFACE_ID ---
        // PostgreSQL no permite múltiples filas para el mismo target de conflicto en un solo INSERT.
        const deduplicatedMap = new Map<number, (typeof valuesToInsert)[0]>();
        for (const val of valuesToInsert) {
          const existing = deduplicatedMap.get(val.interfaceId);
          // Si no existe, o si el nuevo tiene remoteDeviceId y el viejo no, lo reemplazamos
          if (!existing || (val.remoteDeviceId && !existing.remoteDeviceId)) {
            deduplicatedMap.set(val.interfaceId, val);
          }
        }
        const finalValues = Array.from(deduplicatedMap.values());

        logger.info(
          `[LLDP Poll] ${device.ipv4}: Ready to insert ${finalValues.length} unique neighbors after deduplication`,
        );

        if (finalValues.length === 0) return;

        try {
          for (const chunk of chunkArray(finalValues, 1000)) {
            await db
              .insert(lldpNeighborTable)
              .values(chunk)
              .onConflictDoUpdate({
                target: [
                  lldpNeighborTable.deviceId,
                  lldpNeighborTable.interfaceId,
                ],
                set: {
                  lldpRemChassisId: sql`EXCLUDED.lldp_rem_chassis_id`,
                  lldpRemPortIdSubtype: sql`EXCLUDED.lldp_rem_port_id_subtype`,
                  lldpRemPortId: sql`EXCLUDED.lldp_rem_port_id`,
                  lldpRemSysName: sql`EXCLUDED.lldp_rem_sys_name`,
                  remoteDeviceId: sql`EXCLUDED.remote_device_id`,
                  remoteInterfaceId: sql`EXCLUDED.remote_interface_id`,
                  updatedAt: new Date(),
                },
              });
          }
          logger.info(
            `[LLDP Poll] ${device.ipv4}: Successfully saved ${finalValues.length} neighbors`,
          );
        } catch (dbError) {
          logger.error(
            { dbError },
            `[LLDP Poll] ${device.ipv4}: Error during database insertion`,
          );
        }
      }
      logger.info(
        `[LLDP Poll] ${device.ipv4}: Success (${neighborEntries.length} neighbors)`,
      );
    } catch (error) {
      logger.error({ error }, `[LLDP Poll] Error ${device.ipv4}`);
    }
  };

  await Promise.all(devices.map(processDevice));
}
