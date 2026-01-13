import { defineRelations } from 'drizzle-orm';
import * as schema from '@/db';

export const relations = defineRelations(schema, (r) => ({
  computerSystemTable: {
    installedApplicationsTable: r.many.installedApplicationsTable(),
    baseBoardTable: r.many.baseBoardTable(),
    biosTable: r.many.biosTable(),
    computerSystemProductTable: r.many.computerSystemProductTable(),
    diskDriveTable: r.many.diskDriveTable(),
    networkAdapterConfigTable: r.many.networkAdapterConfigTable(),
    networkIdentityTable: r.many.networkIdentityTable(),
    operatingSystemTable: r.many.operatingSystemTable(),
    physicalMemoryTable: r.many.physicalMemoryTable(),
    processorTable: r.many.processorTable(),
    loginTable: r.many.loginTable(),
    runningServicesTable: r.many.runningServicesTable(),
    device: r.one.deviceTable({
      from: r.computerSystemTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
  runningServicesTable: {
    computerSystemTable: r.one.computerSystemTable({
      from: r.runningServicesTable.ComputerSystemId,
      to: r.computerSystemTable.id,
    }),
  },
  userTable: {
    loginTable: r.many.loginTable(),
  },
  loginTable: {
    computerSystemTable: r.one.computerSystemTable({
      from: r.loginTable.ComputerSystemId,
      to: r.computerSystemTable.id,
    }),
    userTable: r.one.userTable({
      from: r.loginTable.userId,
      to: r.userTable.id,
    }),
  },
  dateTable: {
    installedApplicationsTable: r.many.installedApplicationsTable(),
    baseBoardTable: r.many.baseBoardTable(),
    biosTable: r.many.biosTable(),
    computerSystemProductTable: r.many.computerSystemProductTable(),
    diskDriveTable: r.many.diskDriveTable(),
    networkAdapterConfigTable: r.many.networkAdapterConfigTable(),
    networkIdentityTable: r.many.networkIdentityTable(),
    operatingSystemTable: r.many.operatingSystemTable(),
    physicalMemoryTable: r.many.physicalMemoryTable(),
    processorTable: r.many.processorTable(),
  },
  baseBoardTable: {
    computerSystemTable: r.one.computerSystemTable({
      from: r.baseBoardTable.ComputerSystemId,
      to: r.computerSystemTable.id,
    }),
    dateTable: r.one.dateTable({
      from: r.baseBoardTable.DateId,
      to: r.dateTable.id,
    }),
  },
  biosTable: {
    computerSystemTable: r.one.computerSystemTable({
      from: r.biosTable.ComputerSystemId,
      to: r.computerSystemTable.id,
    }),
    dateTable: r.one.dateTable({
      from: r.biosTable.DateId,
      to: r.dateTable.id,
    }),
  },
  computerSystemProductTable: {
    computerSystemTable: r.one.computerSystemTable({
      from: r.computerSystemProductTable.ComputerSystemId,
      to: r.computerSystemTable.id,
    }),
    dateTable: r.one.dateTable({
      from: r.computerSystemProductTable.DateId,
      to: r.dateTable.id,
    }),
  },
  diskDriveTable: {
    computerSystemTable: r.one.computerSystemTable({
      from: r.diskDriveTable.ComputerSystemId,
      to: r.computerSystemTable.id,
    }),
    dateTable: r.one.dateTable({
      from: r.diskDriveTable.DateId,
      to: r.dateTable.id,
    }),
  },
  installedApplicationsTable: {
    computerSystemTable: r.one.computerSystemTable({
      from: r.installedApplicationsTable.ComputerSystemId,
      to: r.computerSystemTable.id,
    }),
    dateTable: r.one.dateTable({
      from: r.installedApplicationsTable.DateId,
      to: r.dateTable.id,
    }),
  },
  networkIdentityTable: {
    computerSystemTable: r.one.computerSystemTable({
      from: r.networkIdentityTable.ComputerSystemId,
      to: r.computerSystemTable.id,
    }),
    dateTable: r.one.dateTable({
      from: r.networkIdentityTable.DateId,
      to: r.dateTable.id,
    }),
    interface: r.one.interfaceTable({
      from: r.networkIdentityTable.interfaceId,
      to: r.interfaceTable.id,
    }),
  },
  networkAdapterConfigTable: {
    computerSystemTable: r.one.computerSystemTable({
      from: r.networkAdapterConfigTable.ComputerSystemId,
      to: r.computerSystemTable.id,
    }),
    dateTable: r.one.dateTable({
      from: r.networkAdapterConfigTable.DateId,
      to: r.dateTable.id,
    }),
  },
  operatingSystemTable: {
    computerSystemTable: r.one.computerSystemTable({
      from: r.operatingSystemTable.ComputerSystemId,
      to: r.computerSystemTable.id,
    }),
    dateTable: r.one.dateTable({
      from: r.operatingSystemTable.DateId,
      to: r.dateTable.id,
    }),
  },
  physicalMemoryTable: {
    computerSystemTable: r.one.computerSystemTable({
      from: r.physicalMemoryTable.ComputerSystemId,
      to: r.computerSystemTable.id,
    }),
    dateTable: r.one.dateTable({
      from: r.physicalMemoryTable.DateId,
      to: r.dateTable.id,
    }),
  },
  processorTable: {
    computerSystemTable: r.one.computerSystemTable({
      from: r.processorTable.ComputerSystemId,
      to: r.computerSystemTable.id,
    }),
    dateTable: r.one.dateTable({
      from: r.processorTable.DateId,
      to: r.dateTable.id,
    }),
  },
  deviceTable: {
    subnet: r.one.subnetTable({
      from: r.deviceTable.subnetId,
      to: r.subnetTable.id,
    }),
    snmpAuth: r.one.snmpAuthTable({
      from: r.deviceTable.snmpAuthId,
      to: r.snmpAuthTable.id,
    }),
    interfaces: r.many.interfaceTable({
      from: r.deviceTable.id,
      to: r.interfaceTable.deviceId,
    }),
    resources: r.many.resourceTable({
      from: r.deviceTable.id,
      to: r.resourceTable.deviceId,
    }),
    system: r.one.systemTable({
      from: r.deviceTable.id,
      to: r.systemTable.deviceId,
    }),
    bridgeBase: r.one.bridgeBaseTable({
      from: r.deviceTable.id,
      to: r.bridgeBaseTable.deviceId,
    }),
    bridgePorts: r.many.bridgePortTable({
      from: r.deviceTable.id,
      to: r.bridgePortTable.deviceId,
    }),
    bridgeFdb: r.many.bridgeFdbTable({
      from: r.deviceTable.id,
      to: r.bridgeFdbTable.deviceId,
    }),
    cdpNeighbors: r.many.cdpNeighborTable({
      from: r.deviceTable.id,
      to: r.cdpNeighborTable.deviceId,
    }),
    lldpNeighbors: r.many.lldpNeighborTable({
      from: r.deviceTable.id,
      to: r.lldpNeighborTable.deviceId,
    }),
    routes: r.many.routeTable({
      from: r.deviceTable.id,
      to: r.routeTable.deviceId,
    }),
    physicalEntities: r.many.entityPhysicalTable({
      from: r.deviceTable.id,
      to: r.entityPhysicalTable.deviceId,
    }),
    ipSnmp: r.one.ipSnmpTable({
      from: r.deviceTable.id,
      to: r.ipSnmpTable.deviceId,
    }),
    hikvision: r.one.hikvisionTable({
      from: r.deviceTable.id,
      to: r.hikvisionTable.deviceId,
    }),
    status: r.one.deviceStatusTable({
      from: r.deviceTable.id,
      to: r.deviceStatusTable.deviceId,
    }),
    location: r.one.locationTable({
      from: r.deviceTable.locationId,
      to: r.locationTable.id,
    }),
    tags: r.many.deviceTagTable({
      from: r.deviceTable.id,
      to: r.deviceTagTable.deviceId,
    }),
    monitorGroups: r.many.monitorGroupDeviceTable({
      from: r.deviceTable.id,
      to: r.monitorGroupDeviceTable.deviceId,
    }),
    portStatus: r.many.portStatusTable({
      from: r.deviceTable.id,
      to: r.portStatusTable.deviceId,
    }),
    winInfoSystems: r.many.computerSystemTable({
      from: r.deviceTable.id,
      to: r.computerSystemTable.deviceId,
    }),
  },
  monitorGroupTable: {
    devices: r.many.monitorGroupDeviceTable({
      from: r.monitorGroupTable.id,
      to: r.monitorGroupDeviceTable.groupId,
    }),
    rules: r.many.monitorRuleTable({
      from: r.monitorGroupTable.id,
      to: r.monitorRuleTable.deviceGroupId,
    }),
  },
  monitorGroupDeviceTable: {
    group: r.one.monitorGroupTable({
      from: r.monitorGroupDeviceTable.groupId,
      to: r.monitorGroupTable.id,
    }),
    device: r.one.deviceTable({
      from: r.monitorGroupDeviceTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
  monitorPortGroupTable: {
    items: r.many.monitorPortGroupItemTable({
      from: r.monitorPortGroupTable.id,
      to: r.monitorPortGroupItemTable.portGroupId,
    }),
    rules: r.many.monitorRuleTable({
      from: r.monitorPortGroupTable.id,
      to: r.monitorRuleTable.portGroupId,
    }),
  },
  monitorPortGroupItemTable: {
    group: r.one.monitorPortGroupTable({
      from: r.monitorPortGroupItemTable.portGroupId,
      to: r.monitorPortGroupTable.id,
    }),
    results: r.many.portStatusTable({
      from: r.monitorPortGroupItemTable.id,
      to: r.portStatusTable.portGroupItemId,
    }),
  },
  monitorRuleTable: {
    deviceGroup: r.one.monitorGroupTable({
      from: r.monitorRuleTable.deviceGroupId,
      to: r.monitorGroupTable.id,
    }),
    portGroup: r.one.monitorPortGroupTable({
      from: r.monitorRuleTable.portGroupId,
      to: r.monitorPortGroupTable.id,
    }),
    results: r.many.portStatusTable({
      from: r.monitorRuleTable.id,
      to: r.portStatusTable.ruleId,
    }),
    notificationActions: r.many.notificationActionTable({
      from: r.monitorRuleTable.id,
      to: r.notificationActionTable.monitorRuleId,
    }),
  },
  notificationActionTable: {
    monitorRule: r.one.monitorRuleTable({
      from: r.notificationActionTable.monitorRuleId,
      to: r.monitorRuleTable.id,
    }),
    ntfyAction: r.one.ntfyActionTable({
      from: r.notificationActionTable.id,
      to: r.ntfyActionTable.notificationActionId,
    }),
  },
  ntfyActionTable: {
    notificationAction: r.one.notificationActionTable({
      from: r.ntfyActionTable.notificationActionId,
      to: r.notificationActionTable.id,
    }),
    topic: r.one.ntfyTopicTable({
      from: r.ntfyActionTable.ntfyTopicId,
      to: r.ntfyTopicTable.id,
    }),
    tags: r.many.ntfyActionTagTable({
      from: r.ntfyActionTable.id,
      to: r.ntfyActionTagTable.ntfyActionId,
    }),
  },
  ntfyActionTagTable: {
    ntfyAction: r.one.ntfyActionTable({
      from: r.ntfyActionTagTable.ntfyActionId,
      to: r.ntfyActionTable.id,
    }),
  },
  ntfyCredentialTable: {
    topics: r.many.ntfyTopicTable({
      from: r.ntfyCredentialTable.id,
      to: r.ntfyTopicTable.credentialId,
    }),
  },
  ntfyTopicTable: {
    credential: r.one.ntfyCredentialTable({
      from: r.ntfyTopicTable.credentialId,
      to: r.ntfyCredentialTable.id,
    }),
    ntfyActions: r.many.ntfyActionTable({
      from: r.ntfyTopicTable.id,
      to: r.ntfyActionTable.ntfyTopicId,
    }),
  },
  portStatusTable: {
    device: r.one.deviceTable({
      from: r.portStatusTable.deviceId,
      to: r.deviceTable.id,
    }),
    rule: r.one.monitorRuleTable({
      from: r.portStatusTable.ruleId,
      to: r.monitorRuleTable.id,
    }),
    portGroupItem: r.one.monitorPortGroupItemTable({
      from: r.portStatusTable.portGroupItemId,
      to: r.monitorPortGroupItemTable.id,
    }),
  },
  tagTable: {
    devices: r.many.deviceTagTable({
      from: r.tagTable.id,
      to: r.deviceTagTable.tagId,
    }),
  },
  deviceTagTable: {
    device: r.one.deviceTable({
      from: r.deviceTagTable.deviceId,
      to: r.deviceTable.id,
    }),
    tag: r.one.tagTable({
      from: r.deviceTagTable.tagId,
      to: r.tagTable.id,
    }),
  },
  locationTable: {
    devices: r.many.deviceTable({
      from: r.locationTable.id,
      to: r.deviceTable.locationId,
    }),
  },
  subnetTable: {
    devices: r.many.deviceTable({
      from: r.subnetTable.id,
      to: r.deviceTable.subnetId,
    }),
  },
  snmpAuthTable: {
    devices: r.many.deviceTable({
      from: r.snmpAuthTable.id,
      to: r.deviceTable.snmpAuthId,
    }),
  },
  metricsDefinitionTable: {
    objects: r.many.metricObjectsTable({
      from: r.metricsDefinitionTable.id,
      to: r.metricObjectsTable.metricsDefinitionId,
    }),
  },
  metricObjectsTable: {
    definition: r.one.metricsDefinitionTable({
      from: r.metricObjectsTable.metricsDefinitionId,
      to: r.metricsDefinitionTable.id,
    }),
  },
  interfaceTable: {
    device: r.one.deviceTable({
      from: r.interfaceTable.deviceId,
      to: r.deviceTable.id,
    }),
    data: r.many.interfaceDataTable({
      from: r.interfaceTable.id,
      to: r.interfaceDataTable.interfaceId,
    }),
    networkIdentities: r.many.networkIdentityTable({
      from: r.interfaceTable.id,
      to: r.networkIdentityTable.interfaceId,
    }),
  },
  interfaceDataTable: {
    interface: r.one.interfaceTable({
      from: r.interfaceDataTable.interfaceId,
      to: r.interfaceTable.id,
    }),
  },
  resourceTable: {
    device: r.one.deviceTable({
      from: r.resourceTable.deviceId,
      to: r.deviceTable.id,
    }),
    swRun: r.many.hrSWRunEntryTable({
      from: r.resourceTable.id,
      to: r.hrSWRunEntryTable.resourceId,
    }),
    swRunPerf: r.many.hrSWRunPerfEntryTable({
      from: r.resourceTable.id,
      to: r.hrSWRunPerfEntryTable.resourceId,
    }),
    swInstalled: r.many.hrSWInstalledEntryTable({
      from: r.resourceTable.id,
      to: r.hrSWInstalledEntryTable.resourceId,
    }),
  },
  hrSWRunEntryTable: {
    resource: r.one.resourceTable({
      from: r.hrSWRunEntryTable.resourceId,
      to: r.resourceTable.id,
    }),
  },
  hrSWRunPerfEntryTable: {
    resource: r.one.resourceTable({
      from: r.hrSWRunPerfEntryTable.resourceId,
      to: r.resourceTable.id,
    }),
  },
  hrSWInstalledEntryTable: {
    resource: r.one.resourceTable({
      from: r.hrSWInstalledEntryTable.resourceId,
      to: r.resourceTable.id,
    }),
  },
  systemTable: {
    device: r.one.deviceTable({
      from: r.systemTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
  bridgeBaseTable: {
    device: r.one.deviceTable({
      from: r.bridgeBaseTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
  bridgePortTable: {
    device: r.one.deviceTable({
      from: r.bridgePortTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
  bridgeFdbTable: {
    device: r.one.deviceTable({
      from: r.bridgeFdbTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
  cdpNeighborTable: {
    device: r.one.deviceTable({
      from: r.cdpNeighborTable.deviceId,
      to: r.deviceTable.id,
    }),
    localInterface: r.one.interfaceTable({
      from: r.cdpNeighborTable.interfaceId,
      to: r.interfaceTable.id,
    }),
    remoteDevice: r.one.deviceTable({
      from: r.cdpNeighborTable.remoteDeviceId,
      to: r.deviceTable.id,
    }),
    remoteInterface: r.one.interfaceTable({
      from: r.cdpNeighborTable.remoteInterfaceId,
      to: r.interfaceTable.id,
    }),
  },
  lldpNeighborTable: {
    device: r.one.deviceTable({
      from: r.lldpNeighborTable.deviceId,
      to: r.deviceTable.id,
    }),
    localInterface: r.one.interfaceTable({
      from: r.lldpNeighborTable.interfaceId,
      to: r.interfaceTable.id,
    }),
    remoteDevice: r.one.deviceTable({
      from: r.lldpNeighborTable.remoteDeviceId,
      to: r.deviceTable.id,
    }),
    remoteInterface: r.one.interfaceTable({
      from: r.lldpNeighborTable.remoteInterfaceId,
      to: r.interfaceTable.id,
    }),
  },
  routeTable: {
    device: r.one.deviceTable({
      from: r.routeTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
  entityPhysicalTable: {
    device: r.one.deviceTable({
      from: r.entityPhysicalTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
  ipSnmpTable: {
    device: r.one.deviceTable({
      from: r.ipSnmpTable.deviceId,
      to: r.deviceTable.id,
    }),
    addrEntries: r.many.ipAddrEntryTable({
      from: r.ipSnmpTable.id,
      to: r.ipAddrEntryTable.ipSnmpId,
    }),
    netToMediaEntries: r.many.ipNetToMediaTable({
      from: r.ipSnmpTable.id,
      to: r.ipNetToMediaTable.ipSnmpId,
    }),
  },
  ipAddrEntryTable: {
    ipSnmp: r.one.ipSnmpTable({
      from: r.ipAddrEntryTable.ipSnmpId,
      to: r.ipSnmpTable.id,
    }),
  },
  ipNetToMediaTable: {
    ipSnmp: r.one.ipSnmpTable({
      from: r.ipNetToMediaTable.ipSnmpId,
      to: r.ipSnmpTable.id,
    }),
  },
  hikvisionTable: {
    device: r.one.deviceTable({
      from: r.hikvisionTable.deviceId,
      to: r.deviceTable.id,
    }),
    interface: r.one.interfaceTable({
      from: r.hikvisionTable.interfaceId,
      to: r.interfaceTable.id,
    }),
  },
  deviceStatusTable: {
    device: r.one.deviceTable({
      from: r.deviceStatusTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
  pangolinAuthTable: {
    pangolinOrg: r.many.pangolinOrgTable({
      from: r.pangolinAuthTable.id,
      to: r.pangolinOrgTable.authId,
    }),
  },
  pangolinOrgTable: {
    auth: r.one.pangolinAuthTable({
      from: r.pangolinOrgTable.authId,
      to: r.pangolinAuthTable.id,
    }),
  },
}));
