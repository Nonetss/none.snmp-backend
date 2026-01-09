import { createRoute, z } from '@hono/zod-openapi';
import { RuleStatusListResponseSchema } from '@/api/v0/monitor/status/status.schema';

export const listPortStatusRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List port status history (Last 100 per rule)',
  tags: ['Monitor Status'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: RuleStatusListResponseSchema,
        },
      },
      description: 'List of rules with their status history',
    },
    500: {
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
      description: 'Internal Server Error',
    },
  },
});
