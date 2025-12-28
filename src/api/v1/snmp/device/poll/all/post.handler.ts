import type { RouteHandler } from '@hono/zod-openapi';
import type { postPollAllRoute, postPollSingleAllRoute } from './post.route';
import { pollInterfaces } from '@/lib/snmp/poll/interface';
import { pollResources } from '@/lib/snmp/poll/resource';
import { pollIpSnmp } from '@/lib/snmp/poll/ip';
import { pollSystem } from '@/lib/snmp/poll/system';

export const postPollAllHandler: RouteHandler<typeof postPollAllRoute> = async (
  c,
) => {
  try {
    // Ejecutamos todos en secuencia para no saturar al mismo tiempo (o Promise.all si prefieres velocidad)
    await pollSystem();
    await pollInterfaces();
    await pollResources();
    await pollIpSnmp();

    return c.json(
      {
        message: 'Complete polling for all devices completed successfully',
        status: 'success',
      },
      200,
    );
  } catch (error: any) {
    console.error('[Poll All Handler] Error:', error);
    return c.json(
      { message: 'Error during complete polling', error: error.message },
      500,
    ) as any;
  }
};

export const postPollSingleAllHandler: RouteHandler<
  typeof postPollSingleAllRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);
  try {
    await pollSystem(deviceId);
    await pollInterfaces(deviceId);
    await pollResources(deviceId);
    await pollIpSnmp(deviceId);

    return c.json(
      {
        message: `Complete polling for device ${id} completed successfully`,
        status: 'success',
      },
      200,
    );
  } catch (error: any) {
    console.error(`[Poll Single All Handler] Error for device ${id}:`, error);
    return c.json(
      {
        message: `Error during complete polling for device ${id}`,
        error: error.message,
      },
      500,
    ) as any;
  }
};
