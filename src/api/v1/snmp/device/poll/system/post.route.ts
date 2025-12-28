import { createRoute, z } from '@hono/zod-openapi';
import { postPollSystemSchema } from './post.schema';

export const postPollSystemRoute = createRoute({
  method: 'post',
  path: '/system',
  summary: 'Poll device system info (All devices)',
  tags: ['Poll'],
  responses: {
    200: {
      content: { 'application/json': { schema: postPollSystemSchema } },
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

export const postPollSingleSystemRoute = createRoute({
  method: 'post',
  path: '/{id}/system',
  summary: 'Poll device system info (Single device)',
  tags: ['Poll'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: postPollSystemSchema } },
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
