import { komodo } from '@/lib/komodo';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getKomodoContainersRoute } from './get.route';

export const getKomodoContainersHandler: RouteHandler<
  typeof getKomodoContainersRoute
> = async (c) => {
  const { serverId } = c.req.param();

  try {
    const containerList = await komodo.read('ListAllDockerContainers', {
      servers: serverId.split(','),
    });

    return c.json(containerList, 200);
  } catch (error) {
    console.error('[Komodo List Servers] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
