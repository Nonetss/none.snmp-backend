import { db } from '@/core/config';
import { taskScheduleTable } from '@/db';

export async function seedDefaultTasks() {
  const existingTasks = await db.select().from(taskScheduleTable);

  if (existingTasks.length > 0) {
    console.log('[Seed] Tasks already exist, skipping default seeding.');
    return;
  }

  console.log('[Seed] No tasks found. Creating default tasks...');

  const defaultTasks = [
    {
      name: 'poll',
      type: 'POLL_ALL',
      targetId: 0,
      cronExpression: '0 * * * *',
      enabled: true,
      status: 'idle',
    },
    {
      name: 'ping',
      type: 'PING_ALL',
      targetId: 0,
      cronExpression: '* * * * *',
      enabled: true,
      status: 'idle',
    },
    {
      name: 'scan',
      type: 'SCAN_ALL_SUBNETS',
      targetId: 0,
      cronExpression: '0 * * * *',
      enabled: true,
      status: 'idle',
    },
  ];

  await db.insert(taskScheduleTable).values(defaultTasks);
  console.log('[Seed] Successfully created default tasks.');
}
