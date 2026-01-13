import type { RouteHandler } from '@hono/zod-openapi';
import type { getPingRoute } from './get.route';
import { pingHost } from '@/lib/icmp';

export const getPingHandler: RouteHandler<typeof getPingRoute> = async (c) => {
  const { host } = c.req.valid('query');

  try {
    const result = await pingHost(host);

    return c.json(
      {
        host,
        alive: result.alive,
        time: result.time,
      },
      200,
    );
  } catch (error) {
    console.error(`[Ping Toolbox] Error for host ${host}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
