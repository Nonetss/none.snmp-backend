import { createRoute } from '@hono/zod-openapi';

import { z } from '@hono/zod-openapi';

export const deletePangolinAuthRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete Pangolin credentials by ID',
  tags: ['Pangolin Auth'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      description: 'Pangolin credentials deleted',
    },
    404: {
      description: 'Credentials not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
