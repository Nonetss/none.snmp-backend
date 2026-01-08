import { createRoute, z } from '@hono/zod-openapi';

export const deleteMonitorPortGroupRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete port group',
  tags: ['Monitor Port Group'],
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
            message: z.string().openapi({ example: 'Group deleted' }),
          }),
        },
      },
      description: 'Group deleted successfully',
    },
    404: {
      description: 'Group not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
