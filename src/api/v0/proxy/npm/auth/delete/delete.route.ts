import { createRoute } from '@hono/zod-openapi';

export const deleteNpmAuthRoute = createRoute({
  method: 'delete',
  path: '/',
  summary: 'Delete NPM credentials',
  tags: ['NPM Auth'],
  responses: {
    200: {
      description: 'NPM credentials deleted',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
