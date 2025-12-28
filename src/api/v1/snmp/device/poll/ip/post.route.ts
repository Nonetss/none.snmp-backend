import { createRoute, z } from '@hono/zod-openapi';
import { postPollIpSchema } from './post.schema';

export const postPollIpRoute = createRoute({
  method: 'post',
  path: '/ip',
  summary: 'Poll device IP and ARP tables',
  description:
    'Triggers a manual poll of IP address table and NetToMedia (ARP) table for all registered devices.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: postPollIpSchema,
        },
      },
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
