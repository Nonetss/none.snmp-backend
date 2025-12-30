import type { RouteHandler } from '@hono/zod-openapi';
import type { postPollLldpRoute, postPollSingleLldpRoute } from './post.route';
import { pollLldp } from '@/lib/snmp/poll/lldp';

export const postPollLldpHandler: RouteHandler<
  typeof postPollLldpRoute
> = async (c) => {
  await pollLldp();
  return c.json({ message: 'Success' }, 200);
};

export const postPollSingleLldpHandler: RouteHandler<
  typeof postPollSingleLldpRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);
  await pollLldp(deviceId);
  return c.json({ message: 'Success' }, 200);
};
