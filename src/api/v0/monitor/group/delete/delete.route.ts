import { createRoute, z } from '@hono/zod-openapi';

export const deleteMonitorGroupRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete monitoring group',
  tags: ['Monitor Group'],
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
