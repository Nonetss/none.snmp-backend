import { getKomodoClient } from '@/lib/komodo';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listKomodoServersRoute } from './get.route';

export const listKomodoServersHandler: RouteHandler<
  typeof listKomodoServersRoute
> = async (c) => {
  try {
    const komodo = await getKomodoClient();
    const [servers, tags] = await Promise.all([
      komodo.read('ListFullServers', {}),
      komodo.read('ListTags', {}),
    ]);

    const tagMap = new Map(tags.map((t: any) => [t._id?.$oid, t.name]));

    const mappedServers = servers.map((server: any) => ({
      ...server,
      id: server._id?.$oid || '',
      description: server.description || '',
      template: server.template || false,
      tags:
        server.tags?.map((tagId: string) => tagMap.get(tagId) || tagId) || [],
      info: null, // Matching schema expectation
      config: {
        ...server.config,
        maintenance_windows: server.config?.maintenance_windows || [],
        ignore_mounts: server.config?.ignore_mounts || [],
        links: server.config?.links || [],
      },
    }));

    return c.json(mappedServers, 200);
  } catch (error) {
    console.error('[Komodo List Servers] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
