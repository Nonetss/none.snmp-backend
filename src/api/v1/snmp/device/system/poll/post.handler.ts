import type { RouteHandler } from '@hono/zod-openapi';
import type {
  postPollSystemRoute,
  postPollSingleSystemRoute,
} from './post.route';
import { pollSystem } from '@/lib/snmp/poll/system';

export const postPollSystemHandler: RouteHandler<
  typeof postPollSystemRoute
> = async (c) => {
  await pollSystem();
  return c.json({ message: 'Success' }, 200);
};

export const postPollSingleSystemHandler: RouteHandler<
  typeof postPollSingleSystemRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  await pollSystem(parseInt(id, 10));
  return c.json({ message: 'Success' }, 200);
};
