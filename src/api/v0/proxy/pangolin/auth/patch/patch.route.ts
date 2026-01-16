import { createRoute } from '@hono/zod-openapi';
import {
  postPangolinAuthRequestSchema,
  pangolinAuthResponseSchema,
} from '../auth.schema';

export const patchPangolinAuthRoute = createRoute({
  method: 'patch',
  path: '/',
  summary: 'Partial update Pangolin credentials',
  tags: ['Pangolin Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: postPangolinAuthRequestSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: pangolinAuthResponseSchema,
        },
      },
      description: 'Pangolin credentials updated',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
