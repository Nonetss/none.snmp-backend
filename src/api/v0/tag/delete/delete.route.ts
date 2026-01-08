import { createRoute, z } from '@hono/zod-openapi';

export const deleteTagRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete a tag',
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
          schema: z.object({
            message: z.string().openapi({ example: 'Tag deleted' }),
          }),
        },
      },
      description: 'Tag deleted successfully',
    },
    404: {
      description: 'Tag not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
