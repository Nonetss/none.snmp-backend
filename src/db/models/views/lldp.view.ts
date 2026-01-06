import { pgView, alias } from 'drizzle-orm/pg-core';
import { lldpNeighborTable } from '@/db/models/device/lldp.table';
import { deviceTable } from '@/db/models/device/device.table';
import { interfaceTable } from '@/db/models/device/interface.table';
import { eq, sql } from 'drizzle-orm';

const localDevice = alias(deviceTable, 'local_device');
const remoteDevice = alias(deviceTable, 'remote_device');
const localInterface = alias(interfaceTable, 'local_interface');
const remoteInterface = alias(interfaceTable, 'remote_interface');

/**
 * Vista consolidada de vecinos LLDP con alias explícitos para evitar colisiones.
 */
export const lldpView = pgView('lldp_view').as((qb) =>
  qb
    .select({
      id: sql`${lldpNeighborTable.id}`.as('id'),

      // --- DISPOSITIVO LOCAL ---
      localDeviceId: sql`${lldpNeighborTable.deviceId}`.as('local_device_id'),
      localDeviceName: sql`${localDevice.name}`.as('local_device_name'),
      localDeviceIpv4: sql`${localDevice.ipv4}`.as('local_device_ipv4'),
      localInterfaceId: sql`${lldpNeighborTable.interfaceId}`.as(
        'local_interface_id',
      ),
      localInterfaceName: sql`${localInterface.ifName}`.as(
        'local_interface_name',
      ),
      localInterfaceDesc: sql`${localInterface.ifDescr}`.as(
        'local_interface_desc',
      ),

      // --- INFORMACIÓN DEL VECINO (SNMP) ---
      neighborSysName: sql`${lldpNeighborTable.sysName}`.as(
        'neighbor_sys_name',
      ),
      neighborPortId: sql`${lldpNeighborTable.portId}`.as('neighbor_port_id'),
      neighborPortDesc: sql`${lldpNeighborTable.portDesc}`.as(
        'neighbor_port_desc',
      ),
      neighborMgmtAddress: sql`${lldpNeighborTable.mgmtAddress}`.as(
        'neighbor_mgmt_address',
      ),
      neighborChassisId: sql`${lldpNeighborTable.chassisId}`.as(
        'neighbor_chassis_id',
      ),

      // --- VECINO RESUELTO EN DB ---
      remoteDeviceId: sql`${lldpNeighborTable.remoteDeviceId}`.as(
        'remote_device_id',
      ),
      remoteDeviceName: sql`${remoteDevice.name}`.as('remote_device_name'),
      remoteDeviceIpv4: sql`${remoteDevice.ipv4}`.as('remote_device_ipv4'),
      remoteInterfaceId: sql`${lldpNeighborTable.remoteInterfaceId}`.as(
        'remote_interface_id',
      ),
      remoteInterfaceName: sql`${remoteInterface.ifName}`.as(
        'remote_interface_name',
      ),

      updatedAt: sql`${lldpNeighborTable.updatedAt}`.as('updated_at'),
    })
    .from(lldpNeighborTable)
    .leftJoin(localDevice, eq(lldpNeighborTable.deviceId, localDevice.id))
    .leftJoin(
      localInterface,
      eq(lldpNeighborTable.interfaceId, localInterface.id),
    )
    .leftJoin(
      remoteDevice,
      eq(lldpNeighborTable.remoteDeviceId, remoteDevice.id),
    )
    .leftJoin(
      remoteInterface,
      eq(lldpNeighborTable.remoteInterfaceId, remoteInterface.id),
    ),
);
