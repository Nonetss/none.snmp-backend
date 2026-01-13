import { createRoute } from '@hono/zod-openapi';
import {
  postKomodoAuthRequestSchema,
  komodoAuthResponseSchema,
} from '../auth.schema';

export const postKomodoAuthRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create or update Komodo credentials',
  tags: ['Komodo Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: postKomodoAuthRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: komodoAuthResponseSchema,
        },
      },
      description: 'Komodo credentials saved',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
