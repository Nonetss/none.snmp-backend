import { createRoute } from '@hono/zod-openapi';
import { CreateMonitorGroupSchema, MonitorGroupSchema } from '../group.schema';

export const postMonitorGroupRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create a new monitoring group',
  tags: ['Monitor Group'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateMonitorGroupSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: MonitorGroupSchema,
        },
      },
      description: 'Group created successfully',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
