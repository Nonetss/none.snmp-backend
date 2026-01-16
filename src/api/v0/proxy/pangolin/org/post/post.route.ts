import { createRoute } from '@hono/zod-openapi';
import {
  postPangolinOrgRequestSchema,
  pangolinOrgResponseSchema,
} from '../org.schema';

export const postPangolinOrgRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create or update Pangolin organization',
  tags: ['Pangolin Org'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: postPangolinOrgRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: pangolinOrgResponseSchema,
        },
      },
      description: 'Pangolin organization saved',
    },
    404: {
      description: 'Pangolin credentials not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
