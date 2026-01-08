import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postScanAllRoute } from './all.route';
import { scanAllSubnets } from '@/lib/snmp/scan';

export const postScanAllHandler: RouteHandler<typeof postScanAllRoute> = async (
  c,
) => {
  try {
    const results = await scanAllSubnets();
    return c.json({ message: 'All subnets scan completed', results }, 200);
  } catch (error: any) {
    console.error('Error in scan all:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
