import { db } from '@/core/config';
import { metricsDefinitionTable, metricObjectsTable } from '@/db';
import { eq } from 'drizzle-orm';
import { join } from 'path';

const OID_DIR = join(process.cwd(), 'OID');
const MIB_FILES = [
  'HOST-RESOURCES-MIB.json',
  'IF-MIB.json',
  'IP-MIB.json',
  'SNMPv2-MIB.json',
  'BRIDGE-MIB.json',
  'CISCO-CDP-MIB.json',
  'LLDP-MIB.json',
  'OSPF-MIB.json',
  'Q-BRIDGE-MIB.json',
  'ENTITY-MIB.json',
  'IP-FORWARD-MIB.json',
  'HIKVISION-MIB.json',
  'HIK-DEVICE-MIB.json',
];

function mapDataType(
  snmpType: string,
):
  | 'counter'
  | 'gauge'
  | 'integer'
  | 'octet_string'
  | 'timeticks'
  | 'counter64' {
  const type = snmpType.toUpperCase();
  if (type.includes('COUNTER64')) return 'counter64';
  if (type.includes('COUNTER')) return 'counter';
  if (type.includes('GAUGE')) return 'gauge';
  if (type.includes('TIMETICKS')) return 'timeticks';
  if (type.includes('INTEGER')) return 'integer';
  return 'octet_string';
}

export async function seedMetrics() {
  const mibsProcessed: string[] = [];

  for (const fileName of MIB_FILES) {
    const filePath = join(OID_DIR, fileName);
    const fileContent = await Bun.file(filePath).text();
    const mibData = JSON.parse(fileContent);

    const moduleName = mibData.meta?.module || fileName.replace('.json', '');

    // Find root OID (moduleidentity)
    let rootOid = '';
    for (const key in mibData) {
      if (mibData[key].class === 'moduleidentity') {
        rootOid = mibData[key].oid;
        break;
      }
    }

    // Upsert metrics definition
    let [definition] = await db
      .select()
      .from(metricsDefinitionTable)
      .where(eq(metricsDefinitionTable.name, moduleName));

    if (!definition) {
      [definition] = await db
        .insert(metricsDefinitionTable)
        .values({
          name: moduleName,
          oid: rootOid || '0.0',
          description: `Seeded from ${fileName}`,
        })
        .returning();
    }

    // Process objects
    const objectsToInsert = [];
    for (const key in mibData) {
      const obj = mibData[key];
      if (obj.nodetype === 'scalar' || obj.nodetype === 'column') {
        objectsToInsert.push({
          metricsDefinitionId: definition.id,
          name: key,
          oidBase: obj.oid,
          dataType: mapDataType(obj.syntax?.type || 'OCTET STRING'),
          unit: obj.units || null,
        });
      }
    }

    if (objectsToInsert.length > 0) {
      for (const obj of objectsToInsert) {
        const [exists] = await db
          .select()
          .from(metricObjectsTable)
          .where(eq(metricObjectsTable.name, obj.name));

        if (!exists) {
          await db.insert(metricObjectsTable).values(obj);
        }
      }
    }

    mibsProcessed.push(moduleName);
  }

  return mibsProcessed;
}
