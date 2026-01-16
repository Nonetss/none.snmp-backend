import { getKomodoClient } from '@/lib/komodo';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getKomodoServerRoute } from './get.route';

export const getKomodoServerHandler: RouteHandler<
  typeof getKomodoServerRoute
> = async (c) => {
  const { serverId } = c.req.valid('param');

  try {
    const komodo = await getKomodoClient();
    const [server, state, stacks, containers, tags] = await Promise.all([
      komodo.read('GetServer', { server: serverId }),
      komodo.read('GetServerState', { server: serverId }),
      komodo.read('ListStacks', {
        query: {
          specific: {
            server_ids: [serverId],
          },
        },
      }),
      komodo.read('ListAllDockerContainers', {
        servers: [serverId],
      }),
      komodo.read('ListTags', {}),
    ]);

    if (!server) {
      return c.json({ message: 'Server not found' }, 404) as any;
    }

    const tagMap = new Map(tags.map((t: any) => [t._id?.$oid, t.name]));

    const response = {
      id: server._id?.$oid || serverId,
      name: server.name,
      description: server.description,
      template: server.template,
      tags:
        server.tags?.map((tagId: string) => tagMap.get(tagId) || tagId) || [],
      state: state.status,
      config: server.config,
      updated_at: server.updated_at,
      stacks: stacks.map((s) => ({
        id: s.id,
        name: s.name,
        state: s.info.state,
        status: s.info.status,
        services: s.info.services?.map((svc) => ({
          service: svc.service,
          image: svc.image,
          update_available: svc.update_available,
        })),
      })),
      containers: containers.map((container) => ({
        id: container.id,
        name: container.name,
        image: container.image,
        state: container.state,
        status: container.status,
        created: container.created,
        image_id: container.image_id,
      })),
    };

    const metadata = {
      exists: true,
      total_stacks: stacks.length,
      total_containers: containers.length,
      total_tags: tags.length,
      tags: tags.map((t: any) => t.name),
    };

    return c.json({ response, metadata }, 200);
  } catch (error) {
    console.error(`[Komodo Get Server] Error for ID ${serverId}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
