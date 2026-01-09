import { createRoute, z } from '@hono/zod-openapi';
import { RuleStatusResponseSchema } from '../status.schema';

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
      deviceId: z.string().optional().openapi({
        description: 'Filter results by device ID',
        example: '1',
      }),
      port: z.string().optional().openapi({
        description: 'Filter results by port number',
        example: '80',
      }),
      from: z.string().optional().openapi({
        description: 'Filter results from this date (ISO 8601)',
        example: '2026-01-08T00:00:00Z',
      }),
      to: z.string().optional().openapi({
        description: 'Filter results until this date (ISO 8601)',
        example: '2026-01-08T23:59:59Z',
      }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: RuleStatusResponseSchema,
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
