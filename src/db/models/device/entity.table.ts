import {
  pgTable,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';

/**
 * ENTITY-MIB (1.3.6.1.2.1.47)
 * Almacena información sobre los componentes físicos del dispositivo (chasis, módulos, sensores, etc.).
 */
export const entityPhysicalTable = pgTable(
  'entity_physical',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id),
    physicalIndex: integer('physical_index').notNull(), // entPhysicalIndex
    descr: varchar('descr', { length: 255 }), // entPhysicalDescr
    vendorType: varchar('vendor_type', { length: 255 }), // entPhysicalVendorType (OID)
    containedIn: integer('contained_in'), // entPhysicalContainedIn
    class: integer('class'), // entPhysicalClass (IANA-ENTITY-MIB)
    parentRelPos: integer('parent_rel_pos'), // entPhysicalParentRelPos
    name: varchar('name', { length: 255 }), // entPhysicalName
    hardwareRev: varchar('hardware_rev', { length: 255 }), // entPhysicalHardwareRev
    firmwareRev: varchar('firmware_rev', { length: 255 }), // entPhysicalFirmwareRev
    softwareRev: varchar('software_rev', { length: 255 }), // entPhysicalSoftwareRev
    serialNum: varchar('serial_num', { length: 255 }), // entPhysicalSerialNum
    mfgName: varchar('mfg_name', { length: 255 }), // entPhysicalMfgName
    modelName: varchar('model_name', { length: 255 }), // entPhysicalModelName
    alias: varchar('alias', { length: 255 }), // entPhysicalAlias
    assetId: varchar('asset_id', { length: 255 }), // entPhysicalAssetID
    isFru: integer('is_fru'), // entPhysicalIsFRU (TruthValue: 1=true, 2=false)
    mfgDate: timestamp('mfg_date', { withTimezone: true }), // entPhysicalMfgDate
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [
    uniqueIndex('entity_physical_device_idx').on(t.deviceId, t.physicalIndex),
  ],
);
