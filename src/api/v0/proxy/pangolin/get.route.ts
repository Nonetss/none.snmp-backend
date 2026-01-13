import { createRoute } from '@hono/zod-openapi';
import { pangolinGetResponseSchema } from './get.schema';

export const pangolinGetRoute = createRoute({
  method: 'get',
  path: '/pangolin',
  tags: ['Pangolin'],
  summary: 'Get All Pangolin Resources',
  description:
    'Retrieve all resources and information from Pangolin without any filtering.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: pangolinGetResponseSchema,
        },
      },
      description: 'Complete list of Pangolin resources',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
