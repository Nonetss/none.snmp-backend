import { komodo } from '@/lib/komodo';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listKomodoContainersRoute } from './list.route';

export const listKomodoContainersHandler: RouteHandler<
  typeof listKomodoContainersRoute
> = async (c) => {
  try {
    const containerList = await komodo.read('ListAllDockerContainers', {});

    return c.json(
      containerList.map((container) => ({
        id: container.id,
        name: container.name,
        serverId: container.server_id,
        image: container.image,
        state: container.state,
        status: container.status,
      })),
      200,
    );
  } catch (error) {
    console.error('[Komodo List All Containers] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
