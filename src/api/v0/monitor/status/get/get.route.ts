import { createRoute, z } from '@hono/zod-openapi';
import { RuleStatusHistorySchema } from '../status.schema';

export const getRuleStatusRoute = createRoute({
  method: 'get',
  path: '/{ruleId}',
  summary: 'Get detailed rule history with filters',
  tags: ['Monitor Status'],
  request: {
    params: z.object({
      ruleId: z.string().openapi({ example: '1' }),
    }),
    query: z.object({
      deviceId: z.string().optional().openapi({ example: '1' }),
      from: z.string().optional().openapi({ example: '2026-01-08T00:00:00Z' }),
      to: z.string().optional().openapi({ example: '2026-01-08T23:59:59Z' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: RuleStatusHistorySchema,
        },
      },
      description: 'Detailed rule status history',
    },
    404: {
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
      description: 'Rule not found',
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
