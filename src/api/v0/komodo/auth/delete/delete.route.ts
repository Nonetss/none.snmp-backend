import { createRoute } from '@hono/zod-openapi';

export const deleteKomodoAuthRoute = createRoute({
  method: 'delete',
  path: '/',
  summary: 'Delete Komodo credentials',
  tags: ['Komodo Auth'],
  responses: {
    200: {
      description: 'Komodo credentials deleted',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
