import { createRoute, z } from '@hono/zod-openapi';
import { domainResponseSchema } from '../domain.schema';

export const getDomainRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get a domain by ID',
  tags: ['Toolbox Domains'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: domainResponseSchema,
        },
      },
      description: 'Domain details',
    },
    404: {
      description: 'Domain not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
