import { getKomodoClient } from '@/lib/komodo';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listKomodoContainersRoute } from './get.route';

export const listKomodoContainersHandler: RouteHandler<
  typeof listKomodoContainersRoute
> = async (c) => {
  try {
    const komodo = await getKomodoClient();
    const containerList = await komodo.read('ListAllDockerContainers', {});

    const metadata = {
      exists: containerList.length > 0,
      total_containers: containerList.length,
      status: {
        running: containerList.filter(
          (container) => container.state === 'running',
        ).length,
        paused: containerList.filter(
          (container) => container.state === 'paused',
        ).length,
        restarting: containerList.filter(
          (container) => container.state === 'restarting',
        ).length,
        exited: containerList.filter(
          (container) => container.state === 'exited',
        ).length,
        created: containerList.filter(
          (container) => container.state === 'created',
        ).length,
        dead: containerList.filter((container) => container.state === 'dead')
          .length,
      },
    };

    return c.json({ response: containerList, metadata }, 200);
  } catch (error) {
    console.error('[Komodo List All Containers] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
