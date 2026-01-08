import { createRoute, z } from '@hono/zod-openapi';
import { TagSchema } from '../tag.schema';

export const listTagRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List all tags',
  tags: ['Tag'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(TagSchema),
        },
      },
      description: 'List of tags',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
