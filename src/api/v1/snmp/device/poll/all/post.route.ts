import { createRoute, z } from '@hono/zod-openapi';
import { postPollAllSchema } from './post.schema';

export const postPollAllRoute = createRoute({
  method: 'post',
  path: '/all',
  summary: 'Poll all data types (All devices)',
  tags: ['SNMP Poll'],
  description:
    'Triggers a manual poll of system, interfaces, resources and IP tables for all devices.',
  responses: {
    200: {
      content: { 'application/json': { schema: postPollAllSchema } },
      description: 'Polling process completed',
    },
    500: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            error: z.string().optional(),
          }),
        },
      },
      description: 'Internal server error',
    },
  },
});

export const postPollSingleAllRoute = createRoute({
  method: 'post',
  path: '/{id}/all',
  summary: 'Poll all data types (Single device)',
  tags: ['SNMP Poll'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: postPollAllSchema } },
      description: 'Polling process completed',
    },
    500: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            error: z.string().optional(),
          }),
        },
      },
      description: 'Internal server error',
    },
  },
});
