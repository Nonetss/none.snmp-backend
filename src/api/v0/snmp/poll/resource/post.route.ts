import { createRoute, z } from '@hono/zod-openapi';
import { postPollResourcesSchema } from './post.schema';

export const postPollResourcesRoute = createRoute({
  method: 'post',
  path: '/resources',
  summary: 'Poll device resources (All devices)',
  tags: ['SNMP Poll', 'Device Resources'],
  responses: {
    200: {
      content: { 'application/json': { schema: postPollResourcesSchema } },
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

export const postPollSingleResourceRoute = createRoute({
  method: 'post',
  path: '/{id}/resources',
  summary: 'Poll device resources (Single device)',
  tags: ['SNMP Poll', 'Device Resources'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: postPollResourcesSchema } },
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
