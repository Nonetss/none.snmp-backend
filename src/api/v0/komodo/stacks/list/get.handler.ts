import { getKomodoClient } from '@/lib/komodo';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listKomodoStacksRoute } from './get.route';

export const listKomodoStacksHandler: RouteHandler<
  typeof listKomodoStacksRoute
> = async (c) => {
  try {
    const komodo = await getKomodoClient();
    const stacks = await komodo.read('ListStacks', {});

    const metadata = {
      exists: stacks.length > 0,
      total_stacks: stacks.length,
    };

    return c.json({ response: stacks, metadata }, 200);
  } catch (error) {
    console.error('[Komodo List Stacks] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
