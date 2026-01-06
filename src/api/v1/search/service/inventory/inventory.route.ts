import { createRoute } from '@hono/zod-openapi';
import {
  ServiceInventoryResponseSchema,
  InventoryPaginationSchema,
} from './inventory.schema';

export const getServiceInventoryRoute = createRoute({
  method: 'get',
  path: '/inventory',
  summary: 'Get all unique services and their devices',
  tags: ['Search'],
  request: {
    query: InventoryPaginationSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ServiceInventoryResponseSchema,
        },
      },
      description: 'Service inventory',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
