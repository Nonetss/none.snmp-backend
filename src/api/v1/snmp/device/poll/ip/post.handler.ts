import type { RouteHandler } from '@hono/zod-openapi';
import type { postPollIpRoute } from './post.route';
import { pollIpSnmp } from '@/lib/snmp/poll/ip';

export const postPollIpHandler: RouteHandler<typeof postPollIpRoute> = async (
  c,
) => {
  try {
    await pollIpSnmp();

    return c.json(
      {
        message: 'IP polling completed successfully',
        status: 'success',
      },
      200,
    );
  } catch (error: any) {
    console.error('[Poll IP Handler] Error:', error);
    return c.json(
      {
        message: 'Error during IP polling',
        error: error.message,
      },
      500,
    ) as any;
  }
};
