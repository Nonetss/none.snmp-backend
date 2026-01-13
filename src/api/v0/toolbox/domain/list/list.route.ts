import { createRoute } from '@hono/zod-openapi';
import { domainListResponseSchema } from '../domain.schema';

export const listDomainRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List all domains',
  tags: ['Toolbox Domains'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: domainListResponseSchema,
        },
      },
      description: 'List of domains',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
