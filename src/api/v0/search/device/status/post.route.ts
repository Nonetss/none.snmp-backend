import { createRoute, z } from '@hono/zod-openapi';

export const postPingAllRoute = createRoute({
  method: 'post',
  path: '/ping',
  summary: 'Force a ping check for all devices immediately',
  tags: ['Device Search'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            total: z.number(),
            up: z.number(),
            down: z.number(),
          }),
        },
      },
      description: 'Ping process completed',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
