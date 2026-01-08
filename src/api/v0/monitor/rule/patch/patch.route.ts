import { createRoute, z } from '@hono/zod-openapi';
import { UpdateMonitorRuleSchema, MonitorRuleSchema } from '../rule.schema';

export const patchMonitorRuleRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update monitoring rule',
  tags: ['Monitor Rule'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateMonitorRuleSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: MonitorRuleSchema,
        },
      },
      description: 'Rule updated successfully',
    },
    404: {
      description: 'Rule not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
