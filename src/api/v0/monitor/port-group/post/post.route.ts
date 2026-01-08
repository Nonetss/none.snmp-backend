import { createRoute } from '@hono/zod-openapi';
import {
  CreateMonitorPortGroupSchema,
  MonitorPortGroupSchema,
} from '../port-group.schema';

export const postMonitorPortGroupRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create a new port group',
  tags: ['Monitor Port Group'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateMonitorPortGroupSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: MonitorPortGroupSchema,
        },
      },
      description: 'Group created successfully',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
