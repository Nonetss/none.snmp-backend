import { getKomodoClient } from '@/lib/komodo';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getKomodoStackRoute } from './get.route';

export const getKomodoStackHandler: RouteHandler<
  typeof getKomodoStackRoute
> = async (c) => {
  try {
    const stackId = c.req.param('stackId');
    const komodo = await getKomodoClient();
    const stacks = await komodo.read('GetStack', {
      stack: stackId,
    });

    return c.json(stacks, 200);
  } catch (error) {
    console.error('[Komodo List Stacks] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
