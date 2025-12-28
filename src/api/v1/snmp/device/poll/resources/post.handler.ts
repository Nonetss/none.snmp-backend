import type { RouteHandler } from '@hono/zod-openapi';
import type {
  postPollResourcesRoute,
  postPollSingleResourceRoute,
} from './post.route';
import { pollResources } from '@/lib/snmp/poll/resource';

export const postPollResourcesHandler: RouteHandler<
  typeof postPollResourcesRoute
> = async (c) => {
  try {
    await pollResources();
    return c.json(
      { message: 'Resource polling completed successfully', status: 'success' },
      200,
    );
  } catch (error: any) {
    console.error('[Poll Resources Handler] Error:', error);
    return c.json(
      { message: 'Error during resource polling', error: error.message },
      500,
    ) as any;
  }
};

export const postPollSingleResourceHandler: RouteHandler<
  typeof postPollSingleResourceRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  try {
    await pollResources(parseInt(id, 10));
    return c.json(
      {
        message: `Resource polling for device ${id} completed successfully`,
        status: 'success',
      },
      200,
    );
  } catch (error: any) {
    console.error(
      `[Poll Single Resource Handler] Error for device ${id}:`,
      error,
    );
    return c.json(
      {
        message: `Error during resource polling for device ${id}`,
        error: error.message,
      },
      500,
    ) as any;
  }
};
