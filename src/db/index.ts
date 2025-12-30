import { deviceTable } from '@/db/models/device/device.table';
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
};
