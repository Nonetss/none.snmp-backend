import { createRoute } from '@hono/zod-openapi';
import { getPingRequestSchema, getPingResponseSchema } from './get.schema';

export const getPingRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Perform a ping to a host',
  tags: ['Toolbox'],
  request: {
    query: getPingRequestSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getPingResponseSchema,
        },
      },
      description: 'Ping result',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
