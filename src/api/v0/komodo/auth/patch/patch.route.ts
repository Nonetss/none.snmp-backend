import { createRoute } from '@hono/zod-openapi';
import {
  postKomodoAuthRequestSchema,
  komodoAuthResponseSchema,
} from '../auth.schema';

export const patchKomodoAuthRoute = createRoute({
  method: 'patch',
  path: '/',
  summary: 'Partial update Komodo credentials',
  tags: ['Komodo Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: postKomodoAuthRequestSchema.partial(),
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
      description: 'Komodo credentials updated',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
