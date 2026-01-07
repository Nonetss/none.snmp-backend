import { createRoute, z } from '@hono/zod-openapi';
import { TaskScheduleSchema } from '../scheduler.schema';

export const listTaskScheduleRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List all scheduled tasks',
  tags: ['SNMP Scheduler'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(TaskScheduleSchema),
        },
      },
      description: 'List of tasks',
    },
  },
});
