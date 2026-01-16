import { createRoute } from '@hono/zod-openapi';
import { bothGetResponseSchema } from './get.schema';

export const bothGetRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Proxy'],
  summary: 'Get All Proxy Hosts',
  description:
    'Authenticate and retrieve all proxy hosts from NPM and Pangolin.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: bothGetResponseSchema,
        },
      },
      description: 'List of NPM proxy hosts',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
