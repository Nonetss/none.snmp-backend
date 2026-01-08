import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  snmpAuthTable,
  hikvisionTable,
  interfaceTable,
} from '@/db';
import { inArray, eq, sql } from 'drizzle-orm';
import { walkSNMP, sanitizeString, normalizeMac } from '@/lib/snmp';
import { logger } from '@/lib/logger';

const HIK_METRICS = [
  // HIKVISION-MIB
  'hikIp',
  'hikPort',
  'hikEntityIndex',
  'hikEntityType',
  'hikEntitySubType',
  'hikOnline',
  'hikService',
  'hikCMSDefType',
  'hikObjectID',
  'hikObjectName',
  'hikTrapHostIp1',
  'hikCPUNum',
  'hikCPUFrequency',
  'hikMemoryCapability',
  'hikMemoryUsage',
  'hikDeviceStatus',
  'hikDeviceLanguage',
  'hikDiskNum',
  // TEST-DEVICE-MIB
  'deviceType',
  'hardwVersion',
  'softwVersion',
  'macAddr',
  'deviceID',
  'manufacturer',
  'cpuPercent',
  'diskSize',
  'diskPercent',
  'memSize',
  'memUsed',
  'restartDev',
  'dynIpAddr',
  'dynNetMask',
  'dynGateway',
  'staticIpAddr',
  'staticNetMask',
  'staticGateway',
  'sysTime',
  'videoInChanNum',
  'videoEncode',
  'videoNetTrans',
  'audioAbility',
  'audioInNum',
  'videoOutNum',
  'clarityChanNum',
  'localStorage',
  'rtspPlayBack',
  'netAccessType',
  'alarmInChanNum',
  'alarmOutChanNum',
  'manageServAddr',
  'ntpServIpAddr',
  'managePort',
] as const;

function formatValue(name: string, value: any): any {
  if (value === null || value === undefined) return null;

  if (name === 'macAddr') {
    return normalizeMac(value);
  }

  if (Buffer.isBuffer(value)) {
    return sanitizeString(value);
  }

  if (
    [
      'hikPort',
      'hikCPUNum',
      'hikMemoryUsage',
      'hikDiskNum',
      'restartDev',
      'videoInChanNum',
      'audioAbility',
      'audioInNum',
      'videoOutNum',
      'clarityChanNum',
      'localStorage',
      'rtspPlayBack',
      'alarmInChanNum',
      'alarmOutChanNum',
      'managePort',
    ].includes(name)
  ) {
    return parseInt(String(value), 10);
  }

  return sanitizeString(value);
}

export async function pollHikvision(deviceId?: number) {
  // 1. Obtener definiciones de métricas
  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, Array.from(HIK_METRICS)));

  if (metrics.length === 0) {
    logger.warn('[Hikvision Poll] No metrics defined for Hikvision MIBs.');
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
  logger.info(`[Hikvision Poll] Processing ${devices.length} devices...`);

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
          return { name: metric.name, result };
        } catch (error) {
          return { name: metric.name, result: [] };
        }
      });

      const data = await Promise.all(promises);
      const hikData: Record<string, any> = {};

      for (const { name, result } of data) {
        if (result.length > 0) {
          // Para estos MIBs de empresa, solemos tomar el primer valor si es un escalar o el valor en la instancia
          hikData[name] = formatValue(name, result[0].value);
        }
      }

      let interfaceId: number | undefined = undefined;

      if (hikData.macAddr || hikData.netAccessType) {
        // Intentar encontrar una interfaz existente con esta MAC para este dispositivo
        let existingInterface = hikData.macAddr
          ? await db.query.interfaceTable.findFirst({
              where: (t, { and, eq }) =>
                and(
                  eq(t.deviceId, device.id),
                  eq(t.ifPhysAddress, hikData.macAddr),
                ),
            })
          : null;

        if (!existingInterface) {
          // Si no existe, crear una interfaz "sintética" (ifIndex 0 o similar)
          const [newInterface] = await db
            .insert(interfaceTable)
            .values({
              deviceId: device.id,
              ifIndex: 0, // Índice reservado para interfaces detectadas vía MIBs de fabricante
              ifName: hikData.netAccessType || 'Hikvision Interface',
              ifPhysAddress: hikData.macAddr,
            })
            .onConflictDoUpdate({
              target: [interfaceTable.deviceId, interfaceTable.ifIndex],
              set: {
                ifName: sql`EXCLUDED.if_name`,
                ifPhysAddress: sql`EXCLUDED.if_phys_address`,
                updatedAt: new Date(),
              },
            })
            .returning({ id: interfaceTable.id });
          interfaceId = newInterface.id;
        } else {
          interfaceId = existingInterface.id;
          // Opcionalmente actualizar el nombre si viene de netAccessType y la interfaz no tiene nombre
          if (hikData.netAccessType && !existingInterface.ifName) {
            await db
              .update(interfaceTable)
              .set({ ifName: hikData.netAccessType, updatedAt: new Date() })
              .where(eq(interfaceTable.id, interfaceId));
          }
        }
      }

      if (Object.keys(hikData).length > 0) {
        await db
          .insert(hikvisionTable)
          .values({
            deviceId: device.id,
            interfaceId,
            hikIp: hikData.hikIp,
            hikPort: hikData.hikPort,
            hikEntityIndex: hikData.hikEntityIndex,
            hikEntityType: hikData.hikEntityType,
            hikEntitySubType: hikData.hikEntitySubType,
            hikOnline: hikData.hikOnline,
            hikService: hikData.hikService,
            hikCMSDefType: hikData.hikCMSDefType,
            hikObjectID: hikData.hikObjectID,
            hikObjectName: hikData.hikObjectName,
            hikTrapHostIp1: hikData.hikTrapHostIp1,
            hikCPUNum: hikData.hikCPUNum,
            hikCPUFrequency: hikData.hikCPUFrequency,
            hikMemoryCapability: hikData.hikMemoryCapability,
            hikMemoryUsage: hikData.hikMemoryUsage,
            hikDeviceStatus: hikData.hikDeviceStatus,
            hikDeviceLanguage: hikData.hikDeviceLanguage,
            hikDiskNum: hikData.hikDiskNum,

            deviceType: hikData.deviceType,
            hardwVersion: hikData.hardwVersion,
            softwVersion: hikData.softwVersion,
            macAddr: hikData.macAddr,
            deviceID: hikData.deviceID,
            manufacturer: hikData.manufacturer,
            cpuPercent: hikData.cpuPercent,
            diskSize: hikData.diskSize,
            diskPercent: hikData.diskPercent,
            memSize: hikData.memSize,
            memUsed: hikData.memUsed,
            restartDev: hikData.restartDev,
            dynIpAddr: hikData.dynIpAddr,
            dynNetMask: hikData.dynNetMask,
            dynGateway: hikData.dynGateway,
            staticIpAddr: hikData.staticIpAddr,
            staticNetMask: hikData.staticNetMask,
            staticGateway: hikData.staticGateway,
            sysTime: hikData.sysTime,
            videoInChanNum: hikData.videoInChanNum,
            videoEncode: hikData.videoEncode,
            videoNetTrans: hikData.videoNetTrans,
            audioAbility: hikData.audioAbility,
            audioInNum: hikData.audioInNum,
            videoOutNum: hikData.videoOutNum,
            clarityChanNum: hikData.clarityChanNum,
            localStorage: hikData.localStorage,
            rtspPlayBack: hikData.rtspPlayBack,
            netAccessType: hikData.netAccessType,
            alarmInChanNum: hikData.alarmInChanNum,
            alarmOutChanNum: hikData.alarmOutChanNum,
            manageServAddr: hikData.manageServAddr,
            ntpServIpAddr: hikData.ntpServIpAddr,
            managePort: hikData.managePort,
          })
          .onConflictDoUpdate({
            target: [hikvisionTable.deviceId],
            set: {
              interfaceId: sql`EXCLUDED.interface_id`,
              hikIp: sql`EXCLUDED.hik_ip`,
              hikPort: sql`EXCLUDED.hik_port`,
              hikEntityIndex: sql`EXCLUDED.hik_entity_index`,
              hikEntityType: sql`EXCLUDED.hik_entity_type`,
              hikEntitySubType: sql`EXCLUDED.hik_entity_sub_type`,
              hikOnline: sql`EXCLUDED.hik_online`,
              hikService: sql`EXCLUDED.hik_service`,
              hikCMSDefType: sql`EXCLUDED.hik_cms_def_type`,
              hikObjectID: sql`EXCLUDED.hik_object_id`,
              hikObjectName: sql`EXCLUDED.hik_object_name`,
              hikTrapHostIp1: sql`EXCLUDED.hik_trap_host_ip1`,
              hikCPUNum: sql`EXCLUDED.hik_cpu_num`,
              hikCPUFrequency: sql`EXCLUDED.hik_cpu_frequency`,
              hikMemoryCapability: sql`EXCLUDED.hik_memory_capability`,
              hikMemoryUsage: sql`EXCLUDED.hik_memory_usage`,
              hikDeviceStatus: sql`EXCLUDED.hik_device_status`,
              hikDeviceLanguage: sql`EXCLUDED.hik_device_language`,
              hikDiskNum: sql`EXCLUDED.hik_disk_num`,

              deviceType: sql`EXCLUDED.device_type`,
              hardwVersion: sql`EXCLUDED.hardw_version`,
              softwVersion: sql`EXCLUDED.softw_version`,
              macAddr: sql`EXCLUDED.mac_addr`,
              deviceID: sql`EXCLUDED.device_id_str`,
              manufacturer: sql`EXCLUDED.manufacturer`,
              cpuPercent: sql`EXCLUDED.cpu_percent`,
              diskSize: sql`EXCLUDED.disk_size`,
              diskPercent: sql`EXCLUDED.disk_percent`,
              memSize: sql`EXCLUDED.mem_size`,
              memUsed: sql`EXCLUDED.mem_used`,
              restartDev: sql`EXCLUDED.restart_dev`,
              dynIpAddr: sql`EXCLUDED.dyn_ip_addr`,
              dynNetMask: sql`EXCLUDED.dyn_net_mask`,
              dynGateway: sql`EXCLUDED.dyn_gateway`,
              staticIpAddr: sql`EXCLUDED.static_ip_addr`,
              staticNetMask: sql`EXCLUDED.static_net_mask`,
              staticGateway: sql`EXCLUDED.static_gateway`,
              sysTime: sql`EXCLUDED.sys_time`,
              videoInChanNum: sql`EXCLUDED.video_in_chan_num`,
              videoEncode: sql`EXCLUDED.video_encode`,
              videoNetTrans: sql`EXCLUDED.video_net_trans`,
              audioAbility: sql`EXCLUDED.audio_ability`,
              audioInNum: sql`EXCLUDED.audio_in_num`,
              videoOutNum: sql`EXCLUDED.video_out_num`,
              clarityChanNum: sql`EXCLUDED.clarity_chan_num`,
              localStorage: sql`EXCLUDED.local_storage`,
              rtspPlayBack: sql`EXCLUDED.rtsp_play_back`,
              netAccessType: sql`EXCLUDED.net_access_type`,
              alarmInChanNum: sql`EXCLUDED.alarm_in_chan_num`,
              alarmOutChanNum: sql`EXCLUDED.alarm_out_chan_num`,
              manageServAddr: sql`EXCLUDED.manage_serv_addr`,
              ntpServIpAddr: sql`EXCLUDED.ntp_serv_ip_addr`,
              managePort: sql`EXCLUDED.manage_port`,
              updatedAt: new Date(),
            },
          });
        logger.info(`[Hikvision Poll] ${device.ipv4}: Success`);
      } else {
        logger.info(`[Hikvision Poll] ${device.ipv4}: No data`);
      }
    } catch (error) {
      logger.error({ error }, `[Hikvision Poll] Error ${device.ipv4}`);
    }
  };

  await Promise.all(devices.map(processDevice));
}
