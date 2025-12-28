import { db } from '@/core/config';
import { sql } from 'drizzle-orm';

async function resetSystem() {
  await db.execute(sql`TRUNCATE TABLE "system" CASCADE;`);
  console.log('Tabla system truncada');
  process.exit(0);
}

resetSystem();
