import {
  pgTable,
  varchar,
  integer,
  uniqueIndex,
  timestamp,
} from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';
import { interfaceTable } from '@/db/models/device/interface.table';

// Hikvision Enterprise MIBs: 1.3.6.1.4.1.50001 and 1.3.6.1.4.1.39165

export const hikvisionTable = pgTable(
  'hikvision',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id),
    interfaceId: integer('interface_id').references(() => interfaceTable.id),

    // HIKVISION-MIB (1.3.6.1.4.1.50001.1)
    hikIp: varchar('hik_ip', { length: 15 }), // hikIp 1.1
    hikPort: integer('hik_port'), // hikPort 1.2
    hikEntityIndex: varchar('hik_entity_index', { length: 255 }), // hikEntityIndex 1.3
    hikEntityType: varchar('hik_entity_type', { length: 255 }), // hikEntityType 1.100
    hikEntitySubType: varchar('hik_entity_sub_type', { length: 255 }), // hikEntitySubType 1.101
    hikOnline: varchar('hik_online', { length: 255 }), // hikOnline 1.102
    hikService: varchar('hik_service', { length: 255 }), // hikService 1.103
    hikCMSDefType: varchar('hik_cms_def_type', { length: 255 }), // hikCMSDefType 1.104
    hikObjectID: varchar('hik_object_id', { length: 255 }), // hikObjectID 1.105
    hikObjectName: varchar('hik_object_name', { length: 255 }), // hikObjectName 1.106
    hikTrapHostIp1: varchar('hik_trap_host_ip1', { length: 15 }), // hikTrapHostIp1 1.110
    hikCPUNum: integer('hik_cpu_num'), // hikCPUNum 1.200
    hikCPUFrequency: varchar('hik_cpu_frequency', { length: 255 }), // hikCPUFrequency 1.201
    hikMemoryCapability: varchar('hik_memory_capability', { length: 255 }), // hikMemoryCapability 1.220
    hikMemoryUsage: integer('hik_memory_usage'), // hikMemoryUsage 1.221
    hikDeviceStatus: varchar('hik_device_status', { length: 255 }), // hikDeviceStatus 1.230
    hikDeviceLanguage: varchar('hik_device_language', { length: 255 }), // hikDeviceLanguage 1.231
    hikDiskNum: integer('hik_disk_num'), // hikDiskNum 1.240

    // TEST-DEVICE-MIB (1.3.6.1.4.1.39165.1)
    deviceType: varchar('device_type', { length: 255 }), // deviceType .1
    hardwVersion: varchar('hardw_version', { length: 255 }), // hardwVersion .2
    softwVersion: varchar('softw_version', { length: 255 }), // softwVersion .3
    macAddr: varchar('mac_addr', { length: 255 }), // macAddr .4 (Aumentado por precaución)
    deviceID: varchar('device_id_str', { length: 255 }), // deviceID .5
    manufacturer: varchar('manufacturer', { length: 255 }), // manufacturer .6
    cpuPercent: varchar('cpu_percent', { length: 255 }), // cpuPercent .7
    diskSize: varchar('disk_size', { length: 255 }), // diskSize .8
    diskPercent: varchar('disk_percent', { length: 255 }), // diskPercent .9
    memSize: varchar('mem_size', { length: 255 }), // memSize .10
    memUsed: varchar('mem_used', { length: 255 }), // memUsed .11
    restartDev: integer('restart_dev'), // restartDev .12
    dynIpAddr: varchar('dyn_ip_addr', { length: 64 }), // dynIpAddr .13
    dynNetMask: varchar('dyn_net_mask', { length: 64 }), // dynNetMask .14
    dynGateway: varchar('dyn_gateway', { length: 64 }), // dynGateway .15
    staticIpAddr: varchar('static_ip_addr', { length: 64 }), // staticIpAddr .16
    staticNetMask: varchar('static_net_mask', { length: 64 }), // staticNetMask .17
    staticGateway: varchar('static_gateway', { length: 64 }), // staticGateway .18
    sysTime: varchar('sys_time', { length: 255 }), // sysTime .19
    videoInChanNum: integer('video_in_chan_num'), // videoInChanNum .20
    videoEncode: varchar('video_encode', { length: 255 }), // videoEncode .21
    videoNetTrans: varchar('video_net_trans', { length: 255 }), // videoNetTrans .22
    audioAbility: integer('audio_ability'), // audioAbility .23
    audioInNum: integer('audio_in_num'), // audioInNum .24
    videoOutNum: integer('video_out_num'), // videoOutNum .25
    clarityChanNum: integer('clarity_chan_num'), // clarityChanNum .26
    localStorage: integer('local_storage'), // localStorage .27
    rtspPlayBack: integer('rtsp_play_back'), // rtspPlayBack .28
    netAccessType: varchar('net_access_type', { length: 255 }), // netAccessType .29
    alarmInChanNum: integer('alarm_in_chan_num'), // alarmInChanNum .30
    alarmOutChanNum: integer('alarm_out_chan_num'), // alarmOutChanNum .31
    manageServAddr: varchar('manage_serv_addr', { length: 64 }), // manageServAddr .32
    ntpServIpAddr: varchar('ntp_serv_ip_addr', { length: 255 }), // ntpServIpAddr .33
    managePort: integer('manage_port'), // managePort .34
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [uniqueIndex('device_hikvision_idx').on(t.deviceId)],
);
