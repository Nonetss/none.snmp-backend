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
    console.error('[Poll IP Handler] Error:', error);
    return c.json(
      { message: 'Error during IP polling', error: error.message },
      500,
    ) as any;
  }
};

export const postPollSingleIpHandler: RouteHandler<
  typeof postPollSingleIpRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  try {
    await pollIpSnmp(parseInt(id, 10));
    return c.json(
      {
        message: `IP polling for device ${id} completed successfully`,
        status: 'success',
      },
      200,
    );
  } catch (error: any) {
    console.error(`[Poll Single IP Handler] Error for device ${id}:`, error);
    return c.json(
      {
        message: `Error during IP polling for device ${id}`,
        error: error.message,
      },
      500,
    ) as any;
  }
};
