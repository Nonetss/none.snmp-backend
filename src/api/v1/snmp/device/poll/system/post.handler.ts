import type { RouteHandler } from '@hono/zod-openapi';
import type { postPollSystemRoute } from './post.route';
import { pollSystem } from '@/lib/snmp/poll/system';

export const postPollSystemHandler: RouteHandler<
  typeof postPollSystemRoute
> = async (c) => {
  try {
    await pollSystem();

    return c.json(
      {
        message: 'System info polling completed successfully',
        status: 'success',
      },
      200,
    );
  } catch (error: any) {
    console.error('[Poll System Handler] Error:', error);
    return c.json(
      {
        message: 'Error during system info polling',
        error: error.message,
      },
      500,
    ) as any;
  }
};
