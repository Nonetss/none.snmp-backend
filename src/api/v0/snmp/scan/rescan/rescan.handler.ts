import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postRescanRoute } from './rescan.route';
import { scanSubnet } from '@/lib/snmp/scan';

export const postRescanHandler: RouteHandler<typeof postRescanRoute> = async (
  c,
) => {
  const { id } = c.req.valid('param');

  try {
    const results = await scanSubnet(id);
    return c.json({ message: 'Scan completed', results }, 200);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return c.json({ message: 'Subnet not found' }, 404) as any;
    }
    console.error('Error in rescan:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
