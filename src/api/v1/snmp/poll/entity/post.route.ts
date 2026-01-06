import { createRoute, z } from '@hono/zod-openapi';

export const postPollEntityRoute = createRoute({
  method: 'post',
  path: '/entity',
  summary: 'Poll Entity data (All devices)',
  tags: ['SNMP Poll', 'Device Entity'],
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

export const postPollSingleEntityRoute = createRoute({
  method: 'post',
  path: '/{id}/entity',
  summary: 'Poll Entity data (Single device)',
  tags: ['SNMP Poll', 'Device Entity'],
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
