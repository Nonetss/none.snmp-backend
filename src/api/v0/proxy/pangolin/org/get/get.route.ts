import { createRoute } from '@hono/zod-openapi';
import { pangolinOrgResponseSchema } from '../org.schema';

export const getPangolinOrgRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Get Pangolin organization',
  tags: ['Pangolin Org'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: pangolinOrgResponseSchema.nullable(),
        },
      },
      description: 'Pangolin organization',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
