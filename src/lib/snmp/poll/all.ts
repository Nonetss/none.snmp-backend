import { pollInterfaces } from './interface';
import { pollResources } from './resource';
import { pollIpSnmp } from './ip';
import { pollSystem } from './system';
import { pollBridge } from './bridge';
import { pollCdp } from './cdp';
import { pollLldp } from './lldp';
import { pollEntity } from './entity';
import { pollRoutes } from './route';
import { pollHikvision } from './hikvision';
import { logger } from '@/lib/logger';

export async function pollAll(deviceId?: number) {
  logger.info(
    `[Poll All] Starting full poll for ${deviceId || 'all devices'}...`,
  );

  // Ejecutamos todos los métodos en paralelo para maximizar la velocidad
  await Promise.all([
    pollSystem(deviceId),
    pollInterfaces(deviceId),
    pollBridge(deviceId),
    pollCdp(deviceId),
    pollLldp(deviceId),
    pollEntity(deviceId),
    pollRoutes(deviceId),
    pollResources(deviceId),
    pollIpSnmp(deviceId),
    pollHikvision(deviceId),
  ]);

  logger.info(`[Poll All] Finished full poll for ${deviceId || 'all devices'}`);
}
