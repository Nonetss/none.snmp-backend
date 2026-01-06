import type { RouteHandler } from '@hono/zod-openapi';
import type { postPollIpRoute, postPollSingleIpRoute } from './post.route';
import { pollIpSnmp } from '@/lib/snmp/poll/ip';

export const postPollIpHandler: RouteHandler<typeof postPollIpRoute> = async (
  c,
) => {
  try {
    await pollIpSnmp();
    return c.json(
      { message: 'IP polling completed successfully', status: 'success' },
      200,
    );
  } catch (error: any) {
    return c.json({ message: 'Error', error: error.message }, 500) as any;
  }
};

export const postPollSingleIpHandler: RouteHandler<
  typeof postPollSingleIpRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  try {
    await pollIpSnmp(parseInt(id, 10));
    return c.json(
      { message: `IP polling for device ${id} completed`, status: 'success' },
      200,
    );
  } catch (error: any) {
    return c.json({ message: 'Error', error: error.message }, 500) as any;
  }
};
