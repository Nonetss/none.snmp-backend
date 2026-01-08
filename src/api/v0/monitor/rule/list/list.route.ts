import { createRoute, z } from '@hono/zod-openapi';
import { MonitorRuleDetailSchema } from '../rule.schema';

export const listMonitorRulesRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List all monitoring rules',
  tags: ['Monitor Rule'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(MonitorRuleDetailSchema),
        },
      },
      description: 'List of monitoring rules with group details',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
