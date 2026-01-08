import { db } from '@/core/config';
import {
  monitorRuleTable,
  monitorGroupDeviceTable,
  monitorPortGroupItemTable,
  portStatusTable,
  deviceTable,
} from '@/db';
import { eq, and } from 'drizzle-orm';
import { checkTcpPort } from '@/lib/tcp';
import { logger } from '@/lib/logger';
import { chunkArray } from '@/lib/db';
import { CronExpressionParser as parser } from 'cron-parser';

/**
 * Ejecuta una regla de monitorización específica.
 */
export async function executeMonitorRule(ruleId: number) {
  const [rule] = await db
    .select()
    .from(monitorRuleTable)
    .where(eq(monitorRuleTable.id, ruleId));

  if (!rule || !rule.enabled) return;

  logger.info(`[Monitor] Executing rule: ${rule.name}`);

  try {
    // 0. Marcar como ejecutando
    await db
      .update(monitorRuleTable)
      .set({ status: 'running', lastRun: new Date() })
      .where(eq(monitorRuleTable.id, ruleId));

    // 1. Obtener dispositivos del grupo
    const devices = await db
      .select({ id: deviceTable.id, ipv4: deviceTable.ipv4 })
      .from(deviceTable)
      .innerJoin(
        monitorGroupDeviceTable,
        eq(deviceTable.id, monitorGroupDeviceTable.deviceId),
      )
      .where(eq(monitorGroupDeviceTable.groupId, rule.deviceGroupId));

    // 2. Obtener puertos del grupo
    const ports = await db
      .select()
      .from(monitorPortGroupItemTable)
      .where(eq(monitorPortGroupItemTable.portGroupId, rule.portGroupId));

    if (devices.length === 0 || ports.length === 0) {
      logger.info(`[Monitor] Rule ${rule.name}: No devices or ports to check.`);
      throw new Error('No devices or ports configured');
    }

    const results: any[] = [];
    const checkTime = new Date();

    // 3. Ejecutar comprobaciones
    for (const device of devices) {
      const deviceResults = await Promise.all(
        ports.map(async (p) => {
          const check = await checkTcpPort(device.ipv4, p.port, 2000);
          return {
            ruleId: rule.id,
            portGroupItemId: p.id,
            deviceId: device.id,
            port: p.port,
            status: check.open,
            responseTime: typeof check.time === 'number' ? check.time : null,
            checkTime,
          };
        }),
      );
      results.push(...deviceResults);
    }

    // 4. Guardar resultados en el histórico
    if (results.length > 0) {
      for (const chunk of chunkArray(results, 1000)) {
        await db.insert(portStatusTable).values(chunk);
      }
    }

    // 5. Calcular siguiente ejecución y finalizar
    const interval = parser.parse(rule.cronExpression);
    const nextRun = interval.next().toDate();

    await db
      .update(monitorRuleTable)
      .set({
        status: 'idle',
        nextRun,
        lastResult: `Success: ${results.length} checks`,
      })
      .where(eq(monitorRuleTable.id, ruleId));

    logger.info(
      `[Monitor] Rule ${rule.name} finished. ${results.length} checks performed.`,
    );
  } catch (error: any) {
    logger.error({ error }, `[Monitor] Rule ${rule.name} failed`);

    try {
      const interval = parser.parse(rule.cronExpression);
      const nextRun = interval.next().toDate();
      await db
        .update(monitorRuleTable)
        .set({
          status: 'idle',
          nextRun,
          lastResult: `Error: ${error.message}`,
        })
        .where(eq(monitorRuleTable.id, ruleId));
    } catch (e) {
      // Error fatal en cron
    }
  }
}

/**
 * Ejecuta todas las reglas de monitorización habilitadas.
 */
export async function monitorAllRules() {
  const rules = await db
    .select({ id: monitorRuleTable.id })
    .from(monitorRuleTable)
    .where(eq(monitorRuleTable.enabled, true));

  logger.info(`[Monitor] Starting checks for ${rules.length} enabled rules.`);

  for (const rule of rules) {
    try {
      await executeMonitorRule(rule.id);
    } catch (error) {
      logger.error(
        { error },
        `[Monitor] Failed to execute rule ID: ${rule.id}`,
      );
    }
  }
}
