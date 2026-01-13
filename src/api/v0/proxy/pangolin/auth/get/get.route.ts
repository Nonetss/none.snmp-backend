import { createRoute } from '@hono/zod-openapi';
import { pangolinAuthResponseSchema } from '../auth.schema';

export const getPangolinAuthRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Get Pangolin credentials',
  tags: ['Pangolin Auth'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: pangolinAuthResponseSchema.nullable(),
        },
      },
      description: 'Pangolin credentials',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
