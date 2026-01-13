import { createRoute, z } from '@hono/zod-openapi';

export const deleteDomainRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete a domain',
  tags: ['Toolbox Domains'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    204: {
      description: 'Domain deleted',
    },
    404: {
      description: 'Domain not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
