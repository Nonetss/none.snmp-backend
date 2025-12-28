import { db } from '@/core/config';
import { sql } from 'drizzle-orm';

async function resetTables() {
  await db.execute(
    sql`TRUNCATE TABLE hr_sw_run_entry, hr_sw_run_perf_entry, hr_sw_installed_entry CASCADE;`,
  );
  console.log('Tablas truncadas');
  process.exit(0);
}

resetTables();
