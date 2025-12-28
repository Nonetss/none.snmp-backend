import { deviceTable } from '@/db/models/device/device.table';
import { subnetTable } from '@/db/models/subnet.table';
import { snmpAuthTable } from '@/db/models/snmpAuth.table';
import { snmpDataTable } from '@/db/models/snmpData.table';
import {
  metricsDefinitionTable,
  metricObjectsTable,
} from '@/db/models/metricsDefinition.table';
import { deviceMetricInstancesTable } from '@/db/models/device/deviceMetricInstances.table';
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

export {
  deviceTable,
  subnetTable,
  // SNMP
  snmpAuthTable,
  snmpDataTable,
  // Metrics
  metricsDefinitionTable,
  metricObjectsTable,
  deviceMetricInstancesTable,
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
};
