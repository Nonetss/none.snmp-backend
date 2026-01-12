import { createRoute } from '@hono/zod-openapi';
import {
  getLoginHistoryQuerySchema,
  getLoginHistoryResponseSchema,
} from './get.schema';

export const getLoginHistoryRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Users'],
  summary: 'Get login history for a computer',
  description:
    'Retrieve all login sessions recorded for a specific computer by name or IP.',
  request: {
    query: getLoginHistoryQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getLoginHistoryResponseSchema,
        },
      },
      description: 'Computer login history',
    },
    404: {
      description: 'Computer not found',
    },
  },
});
