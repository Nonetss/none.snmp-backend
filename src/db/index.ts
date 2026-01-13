import { locationTable } from '@/db/models/location.table';
import { tagTable, deviceTagTable } from '@/db/models/tag.table';
import { deviceTable } from '@/db/models/device/device.table';
import {
  monitorGroupTable,
  monitorGroupDeviceTable,
} from '@/db/models/monitor/monitorGroup.table';
import {
  monitorPortGroupTable,
  monitorPortGroupItemTable,
} from '@/db/models/monitor/monitorPortGroup.table';
import { monitorRuleTable } from '@/db/models/monitor/monitorRule.table';
import { portStatusTable } from '@/db/models/monitor/portStatus.table';
import { deviceStatusTable } from '@/db/models/device/deviceStatus.table';
import { subnetTable } from '@/db/models/subnet.table';
import { snmpAuthTable } from '@/db/models/snmpAuth.table';
import {
  metricsDefinitionTable,
  metricObjectsTable,
} from '@/db/models/metricsDefinition.table';
import {
  interfaceTable,
  interfaceDataTable,
} from '@/db/models/device/interface.table';
import {
  hrSWRunEntryTable,
  hrSWRunPerfEntryTable,
  hrSWInstalledEntryTable,
  resourceTable,
} from '@/db/models/device/resource.table';
import {
  ipSnmpTable,
  ipAddrEntryTable,
  ipNetToMediaTable,
} from '@/db/models/device/ipSnmp.table';
import { systemTable } from '@/db/models/device/system.table';
import {
  bridgeBaseTable,
  bridgePortTable,
  bridgeFdbTable,
  vlanTable,
  bridgeFdbQTable,
} from '@/db/models/device/bridge.table';
import { cdpNeighborTable } from '@/db/models/device/cdp.table';
import { lldpNeighborTable } from '@/db/models/device/lldp.table';
import { entityPhysicalTable } from '@/db/models/device/entity.table';
import { routeTable } from '@/db/models/device/route.table';
import { hikvisionTable } from '@/db/models/enterprise/hikvision.table';
import { taskScheduleTable } from '@/db/models/taskSchedule.table';
import {
  ntfyCredentialTable,
  ntfyTopicTable,
  ntfyActionTable,
  ntfyActionTagTable,
} from '@/db/models/notifications/ntfy.table';
import { notificationActionTable } from '@/db/models/notifications/notification.table';
import { baseBoardTable } from '@/db/models/win-info/baseBoard.table';
import { biosTable } from '@/db/models/win-info/bios.table';
import { computerSystemTable } from '@/db/models/win-info/computerSystem.table';
import { computerSystemProductTable } from '@/db/models/win-info/computerSystemProduct.table';
import { dateTable } from '@/db/models/win-info/date.table';
import { diskDriveTable } from '@/db/models/win-info/diskDrive.table';
import { networkAdapterConfigTable } from '@/db/models/win-info/networkAdapterConfig.table';
import { networkIdentityTable } from '@/db/models/win-info/networkIdentity.table';
import { operatingSystemTable } from '@/db/models/win-info/operatingSystem.table';
import { physicalMemoryTable } from '@/db/models/win-info/physicalMemory.table';
import { processorTable } from '@/db/models/win-info/processor.table';
import { installedApplicationsTable } from '@/db/models/win-info/installedApplications.table';
import { loginTable } from '@/db/models/win-info/login.table';
import { userTable } from '@/db/models/win-info/user.table';
import { runningServicesTable } from '@/db/models/win-info/runningService.table';
import { dnsServerTable } from '@/db/models/toolbox/dnsServer.table';
import { domainTable } from '@/db/models/toolbox/domain.table';
import {
  pangolinAuthTable,
  pangolinOrgTable,
} from '@/db/models/auth/pangolinAuth.table';
import { npmAuthTable } from '@/db/models/auth/npmAuth.table';
import { komodoAuthTable } from '@/db/models/auth/komodoAuth.table';

export {
  deviceTable,
  subnetTable,
  // SNMP
  snmpAuthTable,
  // Metrics
  metricsDefinitionTable,
  metricObjectsTable,
  // Interfaces
  interfaceTable,
  interfaceDataTable,
  // Resources
  hrSWRunEntryTable,
  hrSWRunPerfEntryTable,
  hrSWInstalledEntryTable,
  resourceTable,
  // IP SNMP
  ipSnmpTable,
  ipAddrEntryTable,
  ipNetToMediaTable,
  // Routing
  routeTable,
  // System
  systemTable,
  // Bridge
  bridgeBaseTable,
  bridgePortTable,
  bridgeFdbTable,
  vlanTable,
  bridgeFdbQTable,
  // CDP
  cdpNeighborTable,
  // LLDP
  lldpNeighborTable,
  // Entity
  entityPhysicalTable,
  // Device Status
  deviceStatusTable,
  // Enterprise
  hikvisionTable,
  // Scheduler
  taskScheduleTable,

  // Notifications
  ntfyCredentialTable,
  ntfyTopicTable,
  notificationActionTable,
  ntfyActionTable,
  ntfyActionTagTable,

  // Locations
  locationTable,

  // Tags
  tagTable,
  deviceTagTable,

  // Monitoring
  monitorGroupTable,
  monitorGroupDeviceTable,
  monitorPortGroupTable,
  monitorPortGroupItemTable,
  monitorRuleTable,
  portStatusTable,

  // Win-Info
  baseBoardTable,
  biosTable,
  computerSystemTable,
  computerSystemProductTable,
  dateTable,
  diskDriveTable,
  networkAdapterConfigTable,
  networkIdentityTable,
  operatingSystemTable,
  physicalMemoryTable,
  processorTable,
  installedApplicationsTable,
  loginTable,
  userTable,
  runningServicesTable,

  // Toolbox
  dnsServerTable,
  domainTable,

  // Auth
  komodoAuthTable,
  npmAuthTable,
  pangolinAuthTable,
  pangolinOrgTable,
};
