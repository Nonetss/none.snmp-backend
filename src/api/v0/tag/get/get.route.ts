import { createRoute, z } from '@hono/zod-openapi';
import { TagSchema } from '../tag.schema';

export const getTagRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get a tag by ID',
  tags: ['Tag'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: TagSchema,
        },
      },
      description: 'The tag details',
    },
    404: {
      description: 'Tag not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
