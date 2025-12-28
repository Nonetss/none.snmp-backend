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
} from '@/db/models/device/resource.table';

export {
  deviceTable,
  subnetTable,
  snmpAuthTable,
  snmpDataTable,
  metricsDefinitionTable,
  metricObjectsTable,
  deviceMetricInstancesTable,
  interfaceTable,
  interfaceDataTable,
  hrSWRunEntryTable,
  hrSWRunPerfEntryTable,
  hrSWInstalledEntryTable,
};
