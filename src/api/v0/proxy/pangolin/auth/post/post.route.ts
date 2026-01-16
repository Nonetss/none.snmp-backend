import { createRoute } from '@hono/zod-openapi';
import {
  postPangolinAuthRequestSchema,
  pangolinAuthResponseSchema,
} from '../auth.schema';

export const postPangolinAuthRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create or update Pangolin credentials',
  tags: ['Pangolin Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: postPangolinAuthRequestSchema,
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
      description: 'Pangolin credentials saved',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
