import { createRoute, z } from '@hono/zod-openapi';

export const postPollHikvisionRoute = createRoute({
  method: 'post',
  path: '/hikvision',
  summary: 'Poll Hikvision-specific data (All devices)',
  tags: ['SNMP Poll', 'Enterprise Hikvision'],
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

export const postPollSingleHikvisionRoute = createRoute({
  method: 'post',
  path: '/{id}/hikvision',
  summary: 'Poll Hikvision-specific data (Single device)',
  tags: ['SNMP Poll', 'Enterprise Hikvision'],
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
