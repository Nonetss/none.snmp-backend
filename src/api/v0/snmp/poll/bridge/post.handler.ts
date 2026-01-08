import { pollBridge } from '@/lib/snmp/poll/bridge';
import type { RouteHandler } from '@hono/zod-openapi';
import type {
  postPollBridgeRoute,
  postPollSingleBridgeRoute,
} from './post.route';
import { logger } from '@/lib/logger';

export const postPollBridgeHandler: RouteHandler<
  typeof postPollBridgeRoute
> = async (c) => {
  try {
    await pollBridge();
    return c.json({ message: 'Success' }, 200);
  } catch (error) {
    logger.error({ error }, '[Poll All Bridge] Error');
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};

export const postPollSingleBridgeHandler: RouteHandler<
  typeof postPollSingleBridgeRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);

  try {
    await pollBridge(deviceId);
    return c.json({ message: 'Success' }, 200);
  } catch (error) {
    logger.error(
      { error, deviceId: id },
      `[Poll Single Device Bridge] Error for device ${id}`,
    );
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
