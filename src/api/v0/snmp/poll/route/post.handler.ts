import type { RouteHandler } from '@hono/zod-openapi';
import type {
  postPollRouteRoute,
  postPollSingleRouteRoute,
} from './post.route';
import { pollRoutes } from '@/lib/snmp/poll/route';

export const postPollRouteHandler: RouteHandler<
  typeof postPollRouteRoute
> = async (c) => {
  await pollRoutes();
  return c.json({ message: 'Success' }, 200);
};

export const postPollSingleRouteHandler: RouteHandler<
  typeof postPollSingleRouteRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);
  await pollRoutes(deviceId);
  return c.json({ message: 'Success' }, 200);
};
