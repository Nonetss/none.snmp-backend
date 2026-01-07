import { pingAllDevices } from '@/lib/ping';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postPingAllRoute } from './post.route';

export const postPingAllHandler: RouteHandler<typeof postPingAllRoute> = async (
  c,
) => {
  try {
    // Ejecutamos en segundo plano para no bloquear la respuesta
    pingAllDevices().catch((err) => {
      console.error('[Force Ping All] Background task failed:', err);
    });

    return c.json({ message: 'Ping process started in background' }, 200);
  } catch (error) {
    console.error('[Force Ping All] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
