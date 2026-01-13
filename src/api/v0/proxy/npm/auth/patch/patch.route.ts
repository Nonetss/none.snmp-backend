import { createRoute } from '@hono/zod-openapi';
import {
  postNpmAuthRequestSchema,
  npmAuthResponseSchema,
} from '../auth.schema';

export const patchNpmAuthRoute = createRoute({
  method: 'patch',
  path: '/',
  summary: 'Partial update NPM credentials',
  tags: ['NPM Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: postNpmAuthRequestSchema.partial(),
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
      description: 'NPM credentials updated',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
