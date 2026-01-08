import { pollCdp } from '@/lib/snmp/poll/cdp';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postPollCdpRoute, postPollSingleCdpRoute } from './post.route';
import { logger } from '@/lib/logger';

export const postPollCdpHandler: RouteHandler<typeof postPollCdpRoute> = async (
  c,
) => {
  try {
    await pollCdp();
    return c.json({ message: 'Success' }, 200);
  } catch (error) {
    logger.error({ error }, '[Poll All CDP] Error');
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};

export const postPollSingleCdpHandler: RouteHandler<
  typeof postPollSingleCdpRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);

  try {
    await pollCdp(deviceId);
    return c.json({ message: 'Success' }, 200);
  } catch (error) {
    logger.error(
      { error, deviceId: id },
      `[Poll Single Device CDP] Error for device ${id}`,
    );
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
