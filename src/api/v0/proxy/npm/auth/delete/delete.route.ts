import { createRoute } from '@hono/zod-openapi';

import { z } from '@hono/zod-openapi';

export const deleteNpmAuthRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete NPM credentials by ID',
  tags: ['NPM Auth'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      description: 'NPM credentials deleted',
    },
    404: {
      description: 'Credentials not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
