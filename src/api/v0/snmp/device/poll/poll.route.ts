import { createRoute, z } from '@hono/zod-openapi';

export const postDevicePollAllRoute = createRoute({
  method: 'post',
  path: '/poll/{id}/all',
  summary: 'Poll all data types for a single device',
  tags: ['SNMP Device'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '199' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Success' }),
          }),
        },
      },
      description: 'Polling triggered successfully',
    },
    404: {
      description: 'Device not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
