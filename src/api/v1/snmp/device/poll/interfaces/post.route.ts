import { createRoute, z } from '@hono/zod-openapi';
import { postPollInterfacesSchema } from './post.schema';

export const postPollInterfacesRoute = createRoute({
  method: 'post',
  path: '/interfaces',
  summary: 'Poll network interfaces',
  description:
    'Triggers a manual poll of all registered device interfaces via SNMP.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: postPollInterfacesSchema,
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
