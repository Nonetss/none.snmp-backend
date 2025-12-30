import { createRoute, z } from '@hono/zod-openapi';

export const postPollCdpRoute = createRoute({
  method: 'post',
  path: '/cdp',
  summary: 'Poll CDP data (All devices)',
  tags: ['SNMP Poll', 'Device CDP'],
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

export const postPollSingleCdpRoute = createRoute({
  method: 'post',
  path: '/{id}/cdp',
  summary: 'Poll CDP data (Single device)',
  tags: ['SNMP Poll', 'Device CDP'],
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
