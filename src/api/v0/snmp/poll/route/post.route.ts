import { createRoute, z } from '@hono/zod-openapi';

export const postPollRouteRoute = createRoute({
  method: 'post',
  path: '/route',
  summary: 'Poll Routing data (All devices)',
  tags: ['SNMP Poll', 'Device Routing'],
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

export const postPollSingleRouteRoute = createRoute({
  method: 'post',
  path: '/{id}/route',
  summary: 'Poll Routing data (Single device)',
  tags: ['SNMP Poll', 'Device Routing'],
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
