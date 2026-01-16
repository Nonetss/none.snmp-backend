import { createRoute } from '@hono/zod-openapi';
import { npmGetResponseSchema } from './get.schema';

export const npmGetRoute = createRoute({
  method: 'get',
  path: '/npm',
  tags: ['Proxy'],
  summary: 'Get All NPM Proxy Hosts',
  description:
    'Authenticate and retrieve all proxy hosts from Nginx Proxy Manager.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: npmGetResponseSchema,
        },
      },
      description: 'List of NPM proxy hosts',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
