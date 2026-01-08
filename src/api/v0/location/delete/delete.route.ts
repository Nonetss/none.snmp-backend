import { createRoute, z } from '@hono/zod-openapi';

export const deleteLocationRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete a location',
  tags: ['Location'],
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
            message: z.string().openapi({ example: 'Location deleted' }),
          }),
        },
      },
      description: 'Location deleted successfully',
    },
    404: {
      description: 'Location not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
