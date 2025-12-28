import {
  pgTable,
  varchar,
  integer,
  timestamp,
  doublePrecision,
  bigint,
} from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';

// Inventario de interfaces de red detectadas en el dispositivo.
// Guarda datos estáticos o que cambian poco (nombre, MAC, velocidad nominal).
export const interfaceTable = pgTable('interface', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  deviceId: integer('device_id')
    .notNull()
    .references(() => deviceTable.id),
  interfaceIndex: integer('interface_index').notNull(), // El ifIndex de SNMP
  ifDescr: varchar('if_descr', { length: 255 }), // Descripción del fabricante
  ifName: varchar('if_name', { length: 255 }), // Nombre de la interfaz (ej: eth0, Gi0/1)
  ifType: integer('if_type'), // Tipo IANA (ej: 6 para ethernet)
  ifMtu: integer('if_mtu'),
  ifSpeed: bigint('if_speed', { mode: 'number' }), // Velocidad en bits por segundo
  ifPhysAddress: varchar('if_phys_address', { length: 100 }), // Dirección MAC
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Telemetría de interfaces de red (Series temporales).
// Preparada para TimescaleDB (Hypertable). Guarda estado y tráfico.
export const interfaceDataTable = pgTable('interface_data', {
  interfaceId: integer('interface_id')
    .notNull()
    .references(() => interfaceTable.id),
  time: timestamp('time', { withTimezone: true }).notNull().defaultNow(), // Marca de tiempo (eje de Timescale)
  ifAdminStatus: integer('if_admin_status'), // 1=up, 2=down, 3=testing
  ifOperStatus: integer('if_oper_status'), // Estado real de la línea
  ifInOctets: bigint('if_in_octets', { mode: 'number' }), // Bytes recibidos (Counter)
  ifOutOctets: bigint('if_out_octets', { mode: 'number' }), // Bytes enviados (Counter)
  ifInErrors: integer('if_in_errors'),
  ifOutErrors: integer('if_out_errors'),
});
