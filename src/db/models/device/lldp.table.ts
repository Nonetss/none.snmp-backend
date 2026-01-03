import {
  pgTable,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';
import { interfaceTable } from '@/db/models/device/interface.table';

/**
 * LLDP-MIB (1.0.8802.1.1.2)
 * Almacena información sobre los vecinos descubiertos mediante LLDP.
 * Esta tabla es fundamental para construir el grafo de topología de red.
 */
export const lldpNeighborTable = pgTable(
  'lldp_neighbor',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),

    // Dispositivo que realizó el descubrimiento (el "poller")
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id),

    // Relación con la interfaz local del dispositivo polleado.
    // Ayuda a saber qué puerto físico/lógico tiene la conexión.
    interfaceId: integer('interface_id').references(() => interfaceTable.id),

    // Índices del MIB
    localPortNum: integer('local_port_num').notNull(), // lldpRemLocalPortNum
    neighborIndex: integer('neighbor_index').notNull(), // lldpRemIndex

    // Identidad del Sistema Remoto (Neighbor)
    chassisIdSubtype: integer('chassis_id_subtype'), // LldpChassisIdSubtype (4=mac, 5=network...)
    chassisId: varchar('chassis_id', { length: 255 }), // ID del chasis remoto

    portIdSubtype: integer('port_id_subtype'), // LldpPortIdSubtype (5=ifName, 7=local...)
    portId: varchar('port_id', { length: 255 }), // ID del puerto remoto
    portDesc: varchar('port_desc', { length: 255 }), // Descripción del puerto remoto

    sysName: varchar('sys_name', { length: 255 }), // Nombre del sistema remoto
    sysDesc: varchar('sys_desc', { length: 1024 }), // Descripción del sistema remoto

    sysCapSupported: varchar('sys_cap_supported', { length: 100 }), // Capacidades soportadas (bits)
    sysCapEnabled: varchar('sys_cap_enabled', { length: 100 }), // Capacidades habilitadas (bits)

    // Dirección de gestión remota (útil para identificar al vecino si es un dispositivo conocido)
    mgmtAddress: varchar('mgmt_address', { length: 100 }),

    // --- Resolución de Topología (Cálculo posterior) ---
    // Estos campos permiten navegar el grafo directamente entre registros de nuestra DB.
    remoteDeviceId: integer('remote_device_id').references(
      () => deviceTable.id,
    ),
    remoteInterfaceId: integer('remote_interface_id').references(
      () => interfaceTable.id,
    ),

    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [
    uniqueIndex('lldp_neighbor_device_port_idx').on(
      t.deviceId,
      t.localPortNum,
      t.neighborIndex,
    ),
  ],
);
