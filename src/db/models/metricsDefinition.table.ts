import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';

// Define la MIB o el grupo de métricas (ej: IF-MIB, HOST-RESOURCES-MIB)
// Sirve para agrupar objetos SNMP bajo una misma categoría.
export const metricsDefinitionTable = pgTable('metrics_definition', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: varchar('description', { length: 500 }),
  oid: varchar('oid', { length: 500 }).notNull(), // OID raíz de la MIB/Grupo
  priority: integer('priority').notNull().default(0),
});

// Define los objetos SNMP específicos (columnas de tablas o escalares)
// Ej: ifInOctets, hrProcessorLoad, sysUpTime.
// Se guarda el OID base SIN el índice de instancia final.
export const metricObjectsTable = pgTable('metric_objects', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  metricsDefinitionId: integer('metrics_definition_id')
    .notNull()
    .references(() => metricsDefinitionTable.id),
  name: varchar('name', { length: 100 }).notNull(), // Nombre del objeto (ej: ifInOctets)
  oidBase: varchar('oid_base', { length: 500 }).notNull(), // OID base (ej: 1.3.6.1.2.1.2.2.1.10)
  dataType: varchar('data_type', {
    length: 50,
    enum: [
      'counter',
      'gauge',
      'integer',
      'octet_string',
      'timeticks',
      'counter64',
    ],
  }).notNull(),
  unit: varchar('unit', { length: 20 }), // Unidad de medida (ej: octets, %, ms)
});
