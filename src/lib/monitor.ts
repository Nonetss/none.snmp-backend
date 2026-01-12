import { db } from '@/core/config';
import {
  monitorRuleTable,
  monitorGroupDeviceTable,
  monitorPortGroupItemTable,
  portStatusTable,
  deviceTable,
  notificationActionTable,
  ntfyActionTable,
} from '@/db';
import { eq, and, sql } from 'drizzle-orm';
import { checkTcpPort } from '@/lib/tcp';
import { logger } from '@/lib/logger';
import { chunkArray } from '@/lib/db';
import { CronExpressionParser as parser } from 'cron-parser';
import { processNtfyAction } from '@/lib/notifications/ntfy';

/**
 * Ejecuta una regla de monitorización específica.
 */
export async function executeMonitorRule(
  ruleId: number,
  startTime: Date = new Date(),
) {
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
      .set({ status: 'running', lastRun: startTime })
      .where(eq(monitorRuleTable.id, ruleId));

    // 1. Obtener dispositivos del grupo
    const devices = await db
      .select({
        id: deviceTable.id,
        ipv4: deviceTable.ipv4,
        name: deviceTable.name,
      })
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
    const checkTime = startTime;

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

    // 5. Evaluar notificaciones
    await evaluateNotifications(ruleId, results, devices, ports);

    // 6. Calcular siguiente ejecución y finalizar
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
export async function monitorAllRules(startTime: Date = new Date()) {
  const rules = await db
    .select({ id: monitorRuleTable.id })
    .from(monitorRuleTable)
    .where(eq(monitorRuleTable.enabled, true));

  logger.info(`[Monitor] Starting checks for ${rules.length} enabled rules.`);

  for (const rule of rules) {
    try {
      await executeMonitorRule(rule.id, startTime);
    } catch (error) {
      logger.error(
        { error },
        `[Monitor] Failed to execute rule ID: ${rule.id}`,
      );
    }
  }
}

/**
 * Evalúa si se deben enviar notificaciones para una regla.
 */
async function evaluateNotifications(
  ruleId: number,
  currentResults: any[],
  devices: any[],
  ports: any[],
) {
  const actions = await db
    .select()
    .from(notificationActionTable)
    .where(
      and(
        eq(notificationActionTable.monitorRuleId, ruleId),
        eq(notificationActionTable.enabled, true),
      ),
    );

  if (actions.length === 0) return;

  for (const action of actions) {
    // 1. Determinar si el estado actual es "Down" según la agregación
    const deviceDownStates = devices.map((device) => {
      const deviceResults = currentResults.filter(
        (r) => r.deviceId === device.id,
      );
      const failedPorts = deviceResults.filter((r) => r.status === false);

      if (action.portAggregation === 'all') {
        // Para que el dispositivo esté Down, TODOS sus puertos deben haber fallado
        return failedPorts.length === ports.length && ports.length > 0;
      } else if (action.portAggregation === 'percentage') {
        // Para que el dispositivo esté Down, un PORCENTAJE de sus puertos deben haber fallado
        const threshold = action.portAggregationValue || 0;
        const failedPercentage = (failedPorts.length / ports.length) * 100;
        return failedPercentage >= threshold && ports.length > 0;
      } else {
        // Para que el dispositivo esté Down, AL MENOS UN puerto debe haber fallado
        return failedPorts.length > 0;
      }
    });

    let isRuleDown = false;
    if (action.deviceAggregation === 'all') {
      // Para que la regla esté Down, TODOS los dispositivos deben estar Down
      isRuleDown = deviceDownStates.every((down) => down === true);
    } else if (action.deviceAggregation === 'percentage') {
      // Para que la regla esté Down, un PORCENTAJE de los dispositivos deben estar Down
      const threshold = action.deviceAggregationValue || 0;
      const downCount = deviceDownStates.filter((down) => down === true).length;
      const downPercentage = (downCount / devices.length) * 100;
      isRuleDown = downPercentage >= threshold && devices.length > 0;
    } else {
      // Para que la regla esté Down, AL MENOS UN dispositivo debe estar Down
      isRuleDown = deviceDownStates.some((down) => down === true);
    }

    // 2. Manejar transición de estados y contadores
    if (isRuleDown) {
      // Si está mal, comprobar si debemos notificar
      const shouldNotify = await checkTriggerConditions(action);
      if (shouldNotify) {
        await triggerNotification(action, currentResults);
      }
      // Actualizar estado a failing si no lo estaba
      if (action.lastStatus !== false) {
        await db
          .update(notificationActionTable)
          .set({ lastStatus: false })
          .where(eq(notificationActionTable.id, action.id));
      }
    } else {
      // Si está bien, comprobar si venía de un fallo (Recovery)
      if (action.lastStatus === false) {
        await triggerNotification(action, currentResults, true); // recovery message
      }
      // Actualizar estado a ok
      await db
        .update(notificationActionTable)
        .set({ lastStatus: true })
        .where(eq(notificationActionTable.id, action.id));
    }
  }
}

async function checkTriggerConditions(action: any): Promise<boolean> {
  // Comprobar repeatIntervalMins
  if (action.lastSentAt) {
    const lastSent = new Date(action.lastSentAt).getTime();
    const now = new Date().getTime();
    const diffMins = (now - lastSent) / (1000 * 60);
    if (diffMins < (action.repeatIntervalMins || 60)) {
      return false;
    }
  }

  return true;
}

async function triggerNotification(
  action: any,
  results: any[],
  isRecovery: boolean = false,
) {
  const [rule] = await db
    .select()
    .from(monitorRuleTable)
    .where(eq(monitorRuleTable.id, action.monitorRuleId));

  const failedChecks = results.filter((r) => r.status === false);
  const statusStr = isRecovery ? 'RECOVERED' : 'DOWN';
  let message = `Rule: ${rule?.name}\nStatus: ${statusStr}\nTime: ${new Date().toLocaleString()}`;

  if (!isRecovery) {
    message += `\nFailed: ${failedChecks.length}/${results.length} checks`;
    // Añadir detalle de fallos (primeros 5)
    failedChecks.slice(0, 5).forEach((f) => {
      message += `\n- Device ${f.deviceId} Port ${f.port}`;
    });
  }

  if (action.type === 'ntfy') {
    const [ntfyAction] = await db
      .select()
      .from(ntfyActionTable)
      .where(eq(ntfyActionTable.notificationActionId, action.id));

    if (ntfyAction) {
      await processNtfyAction(ntfyAction.id, message);
    }
  }

  // Actualizar lastSentAt
  await db
    .update(notificationActionTable)
    .set({ lastSentAt: new Date() })
    .where(eq(notificationActionTable.id, action.id));
}
