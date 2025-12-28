import { createRoute, z } from '@hono/zod-openapi';
import { postPollIpSchema } from './post.schema';

export const postPollIpRoute = createRoute({
  method: 'post',
  path: '/ip',
  summary: 'Poll device IP and ARP tables (All devices)',
  tags: ['SNMP Poll'],
  responses: {
    200: {
      content: { 'application/json': { schema: postPollIpSchema } },
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

export const postPollSingleIpRoute = createRoute({
  method: 'post',
  path: '/{id}/ip',
  summary: 'Poll device IP and ARP tables (Single device)',
  tags: ['SNMP Poll'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: postPollIpSchema } },
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
