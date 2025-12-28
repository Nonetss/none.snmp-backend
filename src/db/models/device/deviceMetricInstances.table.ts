import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';
import { metricObjectsTable } from '@/db/models/metricsDefinition.table';
import { deviceTable } from '@/db/models/device/device.table';

// Representa una instancia concreta de una métrica en un dispositivo.
// Aquí es donde se une el OID base con su índice (ej: .0 para escalares, .1, .2 para tablas).
// Se usa para métricas genéricas que no sean interfaces de red.
export const deviceMetricInstancesTable = pgTable('device_metric_instances', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  deviceId: integer('device_id')
    .notNull()
    .references(() => deviceTable.id),
  metricObjectId: integer('metric_object_id')
    .notNull()
    .references(() => metricObjectsTable.id),
  instanceIndex: varchar('instance_index', { length: 100 })
    .notNull()
    .default('0'), // El índice SNMP (.0, .1, .2, etc)
  customName: varchar('custom_name', { length: 255 }), // Nombre amigable (ej: "Core 0 Load", "Disk /")
});
