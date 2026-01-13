import { createRoute } from '@hono/zod-openapi';
import {
  postNpmAuthRequestSchema,
  npmAuthResponseSchema,
} from '../auth.schema';

export const postNpmAuthRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create or update NPM credentials',
  tags: ['NPM Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: postNpmAuthRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: npmAuthResponseSchema,
        },
      },
      description: 'NPM credentials saved',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
