import type { RouteHandler } from '@hono/zod-openapi';
import type {
  postPollHikvisionRoute,
  postPollSingleHikvisionRoute,
} from './post.route';
import { pollHikvision } from '@/lib/snmp/poll/hikvision';
import { logger } from '@/lib/logger';

export const postPollHikvisionHandler: RouteHandler<
  typeof postPollHikvisionRoute
> = async (c) => {
  try {
    await pollHikvision();
    return c.json({ message: 'Success' }, 200);
  } catch (error) {
    logger.error({ error }, '[Poll All Hikvision] Error');
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};

export const postPollSingleHikvisionHandler: RouteHandler<
  typeof postPollSingleHikvisionRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);

  try {
    await pollHikvision(deviceId);
    return c.json({ message: 'Success' }, 200);
  } catch (error) {
    logger.error(
      { error, deviceId: id },
      `[Poll Single Device Hikvision] Error for device ${id}`,
    );
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
