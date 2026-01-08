import { createRoute, z } from '@hono/zod-openapi';

export const deleteMonitorRuleRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete monitoring rule',
  tags: ['Monitor Rule'],
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
            message: z.string().openapi({ example: 'Rule deleted' }),
          }),
        },
      },
      description: 'Rule deleted successfully',
    },
    404: {
      description: 'Rule not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
