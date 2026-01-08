import { pingAllDevices } from '@/lib/ping';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postPingAllRoute } from './post.route';

export const postPingAllHandler: RouteHandler<typeof postPingAllRoute> = async (
  c,
) => {
  try {
    const results = await pingAllDevices();

    return c.json(
      {
        message: 'Ping process completed',
        ...results,
      },
      200,
    );
  } catch (error) {
    console.error('[Force Ping All] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
