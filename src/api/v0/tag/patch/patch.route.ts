import { createRoute, z } from '@hono/zod-openapi';
import { UpdateTagSchema, TagSchema } from '../tag.schema';

export const patchTagRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update a tag',
  tags: ['Tag'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateTagSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: TagSchema,
        },
      },
      description: 'Tag updated successfully',
    },
    404: {
      description: 'Tag not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
