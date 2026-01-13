import { createRoute } from '@hono/zod-openapi';
import { createDomainSchema, domainResponseSchema } from '../domain.schema';

export const postDomainRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create a new domain',
  tags: ['Toolbox Domains'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: createDomainSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: domainResponseSchema,
        },
      },
      description: 'Domain created',
    },
    400: {
      description: 'Invalid input',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
