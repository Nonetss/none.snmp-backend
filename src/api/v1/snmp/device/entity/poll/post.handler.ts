import type { RouteHandler } from '@hono/zod-openapi';
import type {
  postPollEntityRoute,
  postPollSingleEntityRoute,
} from './post.route';
import { pollEntity } from '@/lib/snmp/poll/entity';

export const postPollEntityHandler: RouteHandler<
  typeof postPollEntityRoute
> = async (c) => {
  await pollEntity();
  return c.json({ message: 'Success' }, 200);
};

export const postPollSingleEntityHandler: RouteHandler<
  typeof postPollSingleEntityRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);
  await pollEntity(deviceId);
  return c.json({ message: 'Success' }, 200);
};
