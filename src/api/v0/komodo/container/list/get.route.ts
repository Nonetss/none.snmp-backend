import { createRoute } from '@hono/zod-openapi';
import { containerListResponseSchema } from '@/api/v0/komodo/container/list/get.schema';

export const listKomodoContainersRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List all Komodo containers',
  tags: ['Komodo'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: containerListResponseSchema,
        },
      },
      description: 'List of all Komodo containers',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
