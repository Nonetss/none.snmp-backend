import {
  pgTable,
  timestamp,
  integer,
  doublePrecision,
  text,
} from 'drizzle-orm/pg-core';
import { deviceMetricInstancesTable } from '@/db/models/device/deviceMetricInstances.table';

// Telemetría genérica para cualquier objeto SNMP (Series temporales).
// Preparada para TimescaleDB (Hypertable).
// Guarda tanto valores numéricos (Gauge, Counter) como texto (OctetString).
export const snmpDataTable = pgTable('snmp_data', {
  deviceMetricInstanceId: integer('device_metric_instance_id')
    .notNull()
    .references(() => deviceMetricInstancesTable.id),
  time: timestamp('time', { withTimezone: true }).notNull().defaultNow(), // Marca de tiempo (eje de Timescale)
  valueNum: doublePrecision('value_num'), // Para Counters, Gauges, Integers
  valueStr: text('value_str'), // Para nombres, estados en texto, descripciones
});
