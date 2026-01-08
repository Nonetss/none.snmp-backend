import { createRoute } from '@hono/zod-openapi';
import { CreateMonitorRuleSchema, MonitorRuleSchema } from '../rule.schema';

export const postMonitorRuleRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create a new monitoring rule',
  tags: ['Monitor Rule'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateMonitorRuleSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: MonitorRuleSchema,
        },
      },
      description: 'Rule created successfully',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
