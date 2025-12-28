import { createRoute, z } from '@hono/zod-openapi';
import { postPollSystemSchema } from './post.schema';

export const postPollSystemRoute = createRoute({
  method: 'post',
  path: '/system',
  summary: 'Poll device system info',
  description:
    'Triggers a manual poll of SNMPv2-MIB::system group (uptime, contact, location...) for all devices.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: postPollSystemSchema,
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
