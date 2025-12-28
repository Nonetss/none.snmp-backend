import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';
import { metricsDefinitionTable } from '@/db';

export const deviceMetricInstancesTable = pgTable('device_metric_instances', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  metricId: integer('metric_id')
    .notNull()
    .references(() => metricsDefinitionTable.id),
  objectName: varchar('object_name', { length: 100 }).notNull(),
  oidFull: varchar('oid_full', { length: 500 }).notNull(),
  priority: integer('priority').notNull().default(0),
  unit: varchar('unit', {
    length: 20,
    enum: [
      'octets', // Puede ser tanto texto como datos binarios
      'text', // Caracteres tipos ASCII
      'integer', // Entero
      'counter', // Contador, siempre aumenta
      'gauge', // Medidor, puede aumentar o disminuir
      'timeticks', // Tiempo transcurrido en centésimas de segundo
      'datetime', // Fecha y hora
    ],
  }),
});
