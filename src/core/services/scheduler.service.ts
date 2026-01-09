import cron from 'node-cron';
import { db } from '@/core/config';
import { taskScheduleTable, monitorRuleTable } from '@/db';
import { eq, lt, and, or, isNull } from 'drizzle-orm';
import { CronExpressionParser as parser } from 'cron-parser';
import { scanSubnet, scanAllSubnets } from '@/lib/snmp/scan';
import { pollAll } from '@/lib/snmp/poll/all';
import { pingAllDevices } from '@/lib/ping';
import { monitorAllRules, executeMonitorRule } from '@/lib/monitor';
import { logger } from '@/lib/logger';

export async function initScheduler() {
  console.log('[Scheduler] Initializing...');

  try {
    // 1. Resetear estados bloqueados
    await resetStuckTasks();
    console.log('[Scheduler] Stuck tasks reset.');

    // 2. Inicializar next_run si falta
    await updateNextRuns();
    console.log('[Scheduler] Next runs updated.');

    console.log('[Scheduler] Background tasks starting...');

    // Check every minute
    cron.schedule('* * * * *', async () => {
      const now = new Date();
      console.log(`[Scheduler] Heartbeat at ${now.toISOString()}`);

      try {
        // 1. Find tasks that need to run
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

        if (pendingTasks.length > 0) {
          logger.info(`[Scheduler] Found ${pendingTasks.length} pending tasks`);
        }

        for (const task of pendingTasks) {
          runTask(task);
        }

        // 2. Find monitor rules that need to run
        const pendingRules = await db
          .select()
          .from(monitorRuleTable)
          .where(
            and(
              eq(monitorRuleTable.enabled, true),
              or(
                isNull(monitorRuleTable.nextRun),
                lt(monitorRuleTable.nextRun, now),
              ),
              eq(monitorRuleTable.status, 'idle'),
            ),
          );

        if (pendingRules.length > 0) {
          logger.info(`[Scheduler] Found ${pendingRules.length} pending rules`);
        }

        for (const rule of pendingRules) {
          executeMonitorRule(rule.id, now);
        }
      } catch (error) {
        console.error('[Scheduler] Error in cron loop:', error);
      }
    });

    console.log('[Scheduler] Cron scheduled successfully');
  } catch (error) {
    console.error('[Scheduler] Failed to initialize scheduler:', error);
  }
}

async function updateNextRuns() {
  console.log('[Scheduler] Updating next runs...');
  // A. Para tareas generales
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

  // B. Para reglas de monitorización
  const rules = await db
    .select()
    .from(monitorRuleTable)
    .where(isNull(monitorRuleTable.nextRun));

  for (const rule of rules) {
    try {
      const interval = parser.parse(rule.cronExpression);
      const nextRun = interval.next().toDate();
      await db
        .update(monitorRuleTable)
        .set({ nextRun })
        .where(eq(monitorRuleTable.id, rule.id));
    } catch (e) {
      console.error(
        `[Scheduler] Invalid cron expression for rule ${rule.name}`,
      );
    }
  }
}

async function resetStuckTasks() {
  console.log('[Scheduler] Resetting stuck tasks...');
  try {
    await db
      .update(taskScheduleTable)
      .set({ status: 'idle' })
      .where(eq(taskScheduleTable.status, 'running'));

    await db
      .update(monitorRuleTable)
      .set({ status: 'idle' })
      .where(eq(monitorRuleTable.status, 'running'));
  } catch (error) {
    console.error('[Scheduler] Failed to reset stuck tasks:', error);
  }
}

async function runTask(task: any) {
  logger.info(`[Scheduler] Starting task: ${task.name} (${task.type})`);
  const taskStartTime = new Date();

  try {
    // Mark as running
    await db
      .update(taskScheduleTable)
      .set({ status: 'running', lastRun: taskStartTime })
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
    } else if (task.type === 'MONITOR_ALL_RULES') {
      await monitorAllRules(taskStartTime);
    } else if (task.type === 'MONITOR_RULE' && task.targetId) {
      await executeMonitorRule(task.targetId, taskStartTime);
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

    logger.info(
      `[Scheduler] Task finished: ${task.name}. Next run: ${nextRun}`,
    );
  } catch (error: any) {
    logger.error({ error }, `[Scheduler] Task failed: ${task.name}`);

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
