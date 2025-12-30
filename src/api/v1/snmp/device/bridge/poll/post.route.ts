import { createRoute, z } from '@hono/zod-openapi';

export const postPollBridgeRoute = createRoute({
  method: 'post',
  path: '/bridge',
  summary: 'Poll bridge data (All devices)',
  tags: ['SNMP Poll', 'Device Bridge'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Success' }),
          }),
        },
      },
      description: 'Polling process completed',
    },
    500: {
      description: 'Internal server error',
    },
  },
});

export const postPollSingleBridgeRoute = createRoute({
  method: 'post',
  path: '/{id}/bridge',
  summary: 'Poll bridge data (Single device)',
  tags: ['SNMP Poll', 'Device Bridge'],
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
            message: z.string().openapi({ example: 'Success' }),
          }),
        },
      },
      description: 'Polling process completed',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
