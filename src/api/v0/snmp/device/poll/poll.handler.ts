import type { RouteHandler } from '@hono/zod-openapi';
import type { postDevicePollAllRoute } from './poll.route';
import { pollAll } from '@/lib/snmp/poll/all';

export const postDevicePollAllHandler: RouteHandler<
  typeof postDevicePollAllRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const deviceId = parseInt(id, 10);

    // Ejecutar el poll (esto es asíncrono pero esperamos en el handler para confirmar que se lanzó)
    await pollAll(deviceId);

    return c.json({ message: 'Success' }, 200);
  } catch (error) {
    console.error('[Device Poll All] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
