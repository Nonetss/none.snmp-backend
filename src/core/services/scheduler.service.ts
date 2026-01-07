import cron from 'node-cron';
import { db } from '@/core/config';
import { taskScheduleTable } from '@/db';
import { eq, lt, and, or, isNull } from 'drizzle-orm';
import { CronExpressionParser as parser } from 'cron-parser';
import { scanSubnet, scanAllSubnets } from '@/lib/snmp/scan';
import { pollAll } from '@/lib/snmp/poll/all';
import { pingAllDevices } from '@/lib/ping';

export function initScheduler() {
  console.log('[Scheduler] Initializing...');

  // Correr inmediatamente al arrancar para inicializar el next_run de las tareas que no lo tengan
  updateNextRuns().then(() => {
    // Check every minute
    cron.schedule('* * * * *', async () => {
      const now = new Date();

      // Find tasks that need to run
      const pendingTasks = await db
        .select()
        .from(taskScheduleTable)
        .where(
          and(
            eq(taskScheduleTable.enabled, true),
            or(
              isNull(taskScheduleTable.nextRun),
              lt(taskScheduleTable.nextRun, now),
            ),
            eq(taskScheduleTable.status, 'idle'),
          ),
        );

      for (const task of pendingTasks) {
        runTask(task);
      }
    });
  });
}

async function updateNextRuns() {
  const tasks = await db
    .select()
    .from(taskScheduleTable)
    .where(isNull(taskScheduleTable.nextRun));

  for (const task of tasks) {
    try {
      const interval = parser.parse(task.cronExpression);
      const nextRun = interval.next().toDate();
      await db
        .update(taskScheduleTable)
        .set({ nextRun })
        .where(eq(taskScheduleTable.id, task.id));
    } catch (e) {
      console.error(
        `[Scheduler] Invalid cron expression for task ${task.name}`,
      );
    }
  }
}

async function runTask(task: any) {
  console.log(`[Scheduler] Starting task: ${task.name} (${task.type})`);

  try {
    // Mark as running
    await db
      .update(taskScheduleTable)
      .set({ status: 'running', lastRun: new Date() })
      .where(eq(taskScheduleTable.id, task.id));

    if (task.type === 'SCAN_SUBNET' && task.targetId) {
      await scanSubnet(task.targetId);
    } else if (task.type === 'SCAN_ALL_SUBNETS') {
      await scanAllSubnets();
    } else if (task.type === 'POLL_ALL') {
      await pollAll();
    } else if (task.type === 'POLL_DEVICE' && task.targetId) {
      await pollAll(task.targetId);
    } else if (task.type === 'PING_ALL') {
      await pingAllDevices();
    }

    // Calculate next run
    const interval = parser.parse(task.cronExpression);
    const nextRun = interval.next().toDate();

    await db
      .update(taskScheduleTable)
      .set({
        status: 'idle',
        nextRun,
        lastResult: 'Success',
      })
      .where(eq(taskScheduleTable.id, task.id));

    console.log(
      `[Scheduler] Task finished: ${task.name}. Next run: ${nextRun}`,
    );
  } catch (error: any) {
    console.error(`[Scheduler] Task failed: ${task.name}`, error);

    // Calculate next run anyway to avoid infinite retry loops
    try {
      const interval = parser.parse(task.cronExpression);
      const nextRun = interval.next().toDate();

      await db
        .update(taskScheduleTable)
        .set({
          status: 'idle',
          nextRun,
          lastResult: `Error: ${error.message}`,
        })
        .where(eq(taskScheduleTable.id, task.id));
    } catch (e) {
      await db
        .update(taskScheduleTable)
        .set({ status: 'idle', enabled: false, lastResult: 'Fatal Cron Error' })
        .where(eq(taskScheduleTable.id, task.id));
    }
  }
}
