import { db } from '@/core/config';
import { taskScheduleTable } from '@/db';
import { logger } from '@/lib/logger';

export async function seedDefaultTasks() {
  const existingTasks = await db.select().from(taskScheduleTable);

  if (existingTasks.length > 0) {
    logger.info('[Seed] Tasks already exist, skipping default seeding.');
    return;
  }

  logger.info('[Seed] No tasks found. Creating default tasks...');

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
  logger.info('[Seed] Successfully created default tasks.');
}
