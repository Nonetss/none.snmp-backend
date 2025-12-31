import type { RouteHandler } from '@hono/zod-openapi';
import type { postPollAllRoute, postPollSingleAllRoute } from './post.route';
import { pollAll } from '@/lib/snmp/poll/all';

export const postPollAllHandler: RouteHandler<typeof postPollAllRoute> = async (
  c,
) => {
  await pollAll();
  return c.json({ message: 'Success' }, 200);
};

export const postPollSingleAllHandler: RouteHandler<
  typeof postPollSingleAllRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);
  await pollAll(deviceId);
  return c.json({ message: 'Success' }, 200);
};
