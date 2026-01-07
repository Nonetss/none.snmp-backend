import { createRoute, z } from '@hono/zod-openapi';

export const postPollLldpRoute = createRoute({
  method: 'post',
  path: '/lldp',
  summary: 'Poll LLDP data (All devices)',
  tags: ['SNMP Poll', 'Device LLDP'],
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

export const postPollSingleLldpRoute = createRoute({
  method: 'post',
  path: '/{id}/lldp',
  summary: 'Poll LLDP data (Single device)',
  tags: ['SNMP Poll', 'Device LLDP'],
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
