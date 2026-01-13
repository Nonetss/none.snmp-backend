import { komodo } from '@/lib/komodo';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getKomodoServersRoute } from './get.route';

export const getKomodoServersHandler: RouteHandler<
  typeof getKomodoServersRoute
> = async (c) => {
  try {
    const servers = await komodo.read('ListServers', {});

    return c.json(
      servers.map((s) => ({
        id: s.id,
        name: s.name,
        address: s.info.address,
        state: s.info.state,
        version: s.info.version,
      })),
      200,
    );
  } catch (error) {
    console.error('[Komodo List Servers] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
