import { getKomodoClient } from '@/lib/komodo';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getKomodoContainerRoute } from './get.route';

export const getKomodoContainerHandler: RouteHandler<
  typeof getKomodoContainerRoute
> = async (c) => {
  try {
    const { serverId } = c.req.param();
    const { containerId } = c.req.query();
    const komodo = await getKomodoClient();
    const containerList = await komodo.read('InspectDockerContainer', {
      container: containerId,
      server: serverId,
    });
    const metadata = {
      exists: true,
    };

    return c.json({ response: containerList, metadata }, 200);
  } catch (error) {
    console.error('[Komodo Get Container] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
