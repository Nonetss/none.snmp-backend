import { createRoute } from '@hono/zod-openapi';

import { z } from '@hono/zod-openapi';

export const deleteKomodoAuthRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete Komodo credentials by ID',
  tags: ['Komodo Auth'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      description: 'Komodo credentials deleted',
    },
    404: {
      description: 'Credentials not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
