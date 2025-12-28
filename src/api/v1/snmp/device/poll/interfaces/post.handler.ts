import type { RouteHandler } from '@hono/zod-openapi';
import type { postPollInterfacesRoute } from './post.route';
import { pollInterfaces } from '@/lib/snmp/poll/interface';

export const postPollInterfacesHandler: RouteHandler<
  typeof postPollInterfacesRoute
> = async (c) => {
  try {
    // Ejecutamos el sondeo.
    // Nota: Dependiendo de la cantidad de dispositivos, esto podría tardar.
    // En una app real, podrías querer lanzarlo en background.
    await pollInterfaces();

    return c.json(
      {
        message: 'Interface polling completed successfully',
        status: 'success',
      },
      200,
    );
  } catch (error: any) {
    console.error('[Poll Interfaces Handler] Error:', error);
    return c.json(
      {
        message: 'Error during interface polling',
        error: error.message,
      },
      500,
    ) as any;
  }
};
