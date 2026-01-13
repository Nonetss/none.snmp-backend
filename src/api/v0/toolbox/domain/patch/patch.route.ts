import { createRoute, z } from '@hono/zod-openapi';
import { updateDomainSchema, domainResponseSchema } from '../domain.schema';

export const patchDomainRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update a domain',
  tags: ['Toolbox Domains'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: updateDomainSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: domainResponseSchema,
        },
      },
      description: 'Domain updated',
    },
    404: {
      description: 'Domain not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
