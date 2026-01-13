import { createRoute } from '@hono/zod-openapi';

export const deletePangolinAuthRoute = createRoute({
  method: 'delete',
  path: '/',
  summary: 'Delete Pangolin credentials',
  tags: ['Pangolin Auth'],
  responses: {
    200: {
      description: 'Pangolin credentials deleted',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
