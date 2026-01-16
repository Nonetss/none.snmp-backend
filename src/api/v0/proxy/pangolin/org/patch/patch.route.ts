import { createRoute } from '@hono/zod-openapi';
import {
  postPangolinOrgRequestSchema,
  pangolinOrgResponseSchema,
} from '../org.schema';

export const patchPangolinOrgRoute = createRoute({
  method: 'patch',
  path: '/',
  summary: 'Partial update Pangolin organization',
  tags: ['Pangolin Org'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: postPangolinOrgRequestSchema.partial(),
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
      description: 'Pangolin organization updated',
    },
    404: {
      description: 'Pangolin organization not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
