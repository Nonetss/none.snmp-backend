import { createRoute, z } from '@hono/zod-openapi';
import { MonitorRuleDetailSchema } from '../rule.schema';

export const getMonitorRuleRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get monitoring rule by ID',
  tags: ['Monitor Rule'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: MonitorRuleDetailSchema,
        },
      },
      description: 'Rule details',
    },
    404: {
      description: 'Rule not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
