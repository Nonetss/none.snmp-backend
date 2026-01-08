import type { RouteHandler } from '@hono/zod-openapi';
import type {
  postPollInterfacesRoute,
  postPollSingleInterfaceRoute,
} from './post.route';
import { pollInterfaces } from '@/lib/snmp/poll/interface';
import { logger } from '@/lib/logger';

export const postPollInterfacesHandler: RouteHandler<
  typeof postPollInterfacesRoute
> = async (c) => {
  try {
    await pollInterfaces();
    return c.json(
      {
        message: 'Interface polling completed successfully',
        status: 'success',
      },
      200,
    );
  } catch (error: any) {
    logger.error({ error }, '[Poll Interfaces Handler] Error');
    return c.json(
      { message: 'Error during interface polling', error: error.message },
      500,
    ) as any;
  }
};

export const postPollSingleInterfaceHandler: RouteHandler<
  typeof postPollSingleInterfaceRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  try {
    await pollInterfaces(parseInt(id, 10));
    return c.json(
      {
        message: `Interface polling for device ${id} completed successfully`,
        status: 'success',
      },
      200,
    );
  } catch (error: any) {
    logger.error(
      { error, deviceId: id },
      `[Poll Single Interface Handler] Error for device ${id}`,
    );
    return c.json(
      {
        message: `Error during interface polling for device ${id}`,
        error: error.message,
      },
      500,
    ) as any;
  }
};
