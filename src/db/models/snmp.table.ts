import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';

export const snmpTable = pgTable('snmp', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  version: varchar('version', { enum: ['v1', 'v2c', 'v3'] }).notNull(),
  port: integer('port').notNull().default(161),
  community: varchar('community').notNull(),
  v3User: varchar('v3_user').notNull(),
  v3AuthProtocol: varchar('v3_auth_protocol', {
    enum: ['md5', 'sha'],
  }).notNull(),
  v3AuthKey: varchar('v3_auth_key').notNull(),
  v3PrivProtocol: varchar('v3_priv_protocol', {
    enum: ['aes', 'des'],
  }).notNull(),
  v3PrivKey: varchar('v3_priv_key').notNull(),
  v3Level: varchar('v3_level', {
    enum: ['noAuthNoPriv', 'authNoPriv', 'authPriv'],
  }).notNull(),
});
