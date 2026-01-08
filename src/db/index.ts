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
import { lldpView } from '@/db/models/views/lldp.view';

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

  // Views
  lldpView,
};
