import { createRoute } from '@hono/zod-openapi';
import { getStatsResponseSchema } from './get.schema';

export const getStatsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Search'],
  summary: 'Get database statistics',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getStatsResponseSchema,
        },
      },
      description: 'Statistics retrieved successfully',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
