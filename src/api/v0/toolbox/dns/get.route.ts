import { createRoute } from '@hono/zod-openapi';
import { getDnsRequestSchema, getDnsResponseSchema } from './get.schema';

export const getDnsRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Resolve DNS records for a domain',
  tags: ['Toolbox'],
  request: {
    query: getDnsRequestSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getDnsResponseSchema,
        },
      },
      description: 'DNS resolution result',
    },
    400: {
      description: 'Invalid request',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
