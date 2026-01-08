import { db } from '@/core/config';
import { deviceTable, deviceStatusTable } from '@/db';
import { pingHost } from '@/lib/icmp';
import { sql } from 'drizzle-orm';
import { logger } from '@/lib/logger';

export async function pingAllDevices() {
  const devices = await db
    .select({ id: deviceTable.id, ipv4: deviceTable.ipv4 })
    .from(deviceTable);

  logger.info(`[Ping] Pinging ${devices.length} devices...`);

  const results = await Promise.all(
    devices.map(async (device) => {
      const res = await pingHost(device.ipv4);
      const now = new Date();

      return {
        deviceId: device.id,
        status: res.alive,
        lastPing: now,
        lastPingUp: res.alive ? now : undefined,
      };
    }),
  );

  const up = results.filter((r) => r.status).length;
  const down = results.length - up;

  for (const res of results) {
    await db
      .insert(deviceStatusTable)
      .values({
        deviceId: res.deviceId,
        status: res.status,
        lastPing: res.lastPing,
        lastPingUp: res.lastPingUp,
      })
      .onConflictDoUpdate({
        target: [deviceStatusTable.deviceId],
        set: {
          status: res.status,
          lastPing: res.lastPing,
          ...(res.lastPingUp ? { lastPingUp: res.lastPingUp } : {}),
        },
      });
  }

  logger.info(`[Ping] Ping finished: ${up} up, ${down} down`);

  return {
    total: devices.length,
    up,
    down,
  };
}
