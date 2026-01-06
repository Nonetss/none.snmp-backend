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
    interfaceId: integer('interface_id')
      .references(() => interfaceTable.id)
      .notNull(),

    // Informacion del vecino
    lldpRemChassisId: varchar('lldp_rem_chassis_id', { length: 255 }), // MAC del puerto vecido o dispositivo vecino
    lldpRemPortIdSubtype: integer('lldp_rem_port_id_subtype'), // Subtipo del puerto del vecino
    lldpRemPortId: varchar('lldp_rem_port_id', { length: 255 }), // Nombre del puerto del vecino
    lldpRemSysName: varchar('lldp_rem_sys_name', { length: 255 }), // Nombre del dispositivo vecino

    remoteDeviceId: integer('remote_device_id').references(
      () => deviceTable.id,
    ), // Puede ser nulo porque el dispositivo puede salir y no estar en el snmp
    remoteInterfaceId: integer('remote_interface_id').references(
      () => interfaceTable.id,
    ), // Puede ser nulo porque el puerto puede salir y no estar en el snmp

    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [
    uniqueIndex('lldp_neighbor_device_port_idx').on(t.deviceId, t.interfaceId),
  ],
);
