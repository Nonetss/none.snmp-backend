import { createRoute } from '@hono/zod-openapi';
import {
  ApplicationInventoryResponseSchema,
  InventoryPaginationSchema,
} from './inventory.schema';

export const getApplicationInventoryRoute = createRoute({
  method: 'get',
  path: '/inventory',
  summary: 'Get all unique applications and their devices',
  tags: ['Search'],
  request: {
    query: InventoryPaginationSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ApplicationInventoryResponseSchema,
        },
      },
      description: 'Application inventory',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
