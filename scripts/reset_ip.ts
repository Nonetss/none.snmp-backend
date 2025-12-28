import { db } from '@/core/config';
import { sql } from 'drizzle-orm';

async function resetIpTables() {
  await db.execute(
    sql`TRUNCATE TABLE ip_snmp, ip_addr_entry, ip_net_to_media_table CASCADE;`,
  );
  console.log('Tablas IP truncadas');
  process.exit(0);
}

resetIpTables();
