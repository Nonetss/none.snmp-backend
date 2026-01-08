import { createRoute, z } from '@hono/zod-openapi';
import { LocationSchema } from '../location.schema';

export const listLocationRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List all locations',
  tags: ['Location'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(LocationSchema),
        },
      },
      description: 'List of locations',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
