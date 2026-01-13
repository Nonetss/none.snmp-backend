import { komodo } from '@/lib/komodo';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listKomodoStacksRoute } from './list.route';

export const listKomodoStacksHandler: RouteHandler<
  typeof listKomodoStacksRoute
> = async (c) => {
  try {
    const stacks = await komodo.read('ListStacks', {});

    return c.json(
      stacks.map((s) => ({
        id: s.id,
        name: s.name,
        serverId: s.info.server_id,
        state: s.info.state,
        status: s.info.status,
        services: s.info.services?.map((svc) => ({
          service: svc.service,
          image: svc.image,
          update_available: svc.update_available,
        })),
      })),
      200,
    );
  } catch (error) {
    console.error('[Komodo List Stacks] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
