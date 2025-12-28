import {
  pgTable,
  varchar,
  integer,
  timestamp,
  doublePrecision,
} from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db';

export const interfaceTable = pgTable('interface', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(), // Indica el nombre de la interfaz
  interfaceIndex: integer('interface_index').notNull(), // Indica el índice de la interfaz
  ifType: integer('if_type').notNull(), // Indica el tipo de la interfaz, por ejemplo, Ethernet, Loopback, etc.
  ifMtu: integer('if_mtu').notNull(), // Indica el tamaño máximo de los paquetes que puede enviar la interfaz
  ifSpeed: integer('if_speed').notNull(), // Indica la velocidad de la interfaz en Mbps
  ifPhysAddress: varchar('if_phys_address', { length: 100 }).notNull(), // Indica la dirección física de la interfaz
  deviceId: integer('device_id')
    .notNull()
    .references(() => deviceTable.id),
});

export const interfaceDataTable = pgTable('interface_data', {
  time: timestamp('time', { withTimezone: true }).notNull(),
  interfaceId: integer('interface_id')
    .notNull()
    .references(() => interfaceTable.id),
  ifAdminStatus: integer('if_admin_status').notNull(), // Indica si el administrador ha encendido o apagado la interfaz
  ifOperStatus: integer('if_oper_status').notNull(), // Indica si la interfaz tiene un cable conectado y si este está funcionando correctamente
  ifLastChange: timestamp('if_last_change', { withTimezone: true }).notNull(), // Indica la fecha y hora de la última vez que la interfaz cambió de estado
  ifInOctets: doublePrecision('if_in_octets').notNull(), // Indica el número de octetos recibidos por la interfaz
  ifOutOctets: doublePrecision('if_out_octets').notNull(), // Indica el número de octetos enviados por la interfaz
  ifInErrors: integer('if_in_errors').notNull(), // Indica el número de errores de recepción
  ifOutErrors: integer('if_out_errors').notNull(), // Indica el número de errores de transmisión
  ifInDiscards: integer('if_in_discards').notNull(), // Indica el número de paquetes descartados por la interfaz
  ifOutDiscards: integer('if_out_discards').notNull(), // Indica el número de paquetes descartados por la interfaz
});
