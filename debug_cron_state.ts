import { db } from './src/core/config';
import { monitorRuleTable, taskScheduleTable } from './src/db';

async function checkStatus() {
  const rules = await db.select().from(monitorRuleTable);
  const tasks = await db.select().from(taskScheduleTable);

  console.log('--- Rules ---');
  console.log(JSON.stringify(rules, null, 2));

  console.log('\n--- Tasks ---');
  console.log(JSON.stringify(tasks, null, 2));

  const now = new Date();
  console.log(`\nCurrent server time: ${now.toISOString()}`);
}

checkStatus().then(() => process.exit(0));
