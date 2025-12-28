import { createRoute, z } from '@hono/zod-openapi';
import { postPollResourcesSchema } from './post.schema';

export const postPollResourcesRoute = createRoute({
  method: 'post',
  path: '/resources',
  summary: 'Poll device resources (processes)',
  description:
    'Triggers a manual poll of system resources (running software) for all registered devices.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: postPollResourcesSchema,
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
