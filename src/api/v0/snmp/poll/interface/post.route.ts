import { createRoute, z } from '@hono/zod-openapi';
import { postPollInterfacesSchema } from './post.schema';

export const postPollInterfacesRoute = createRoute({
  method: 'post',
  path: '/interfaces',
  summary: 'Poll network interfaces (All devices)',
  tags: ['SNMP Poll', 'Device Interfaces'],
  description:
    'Triggers a manual poll of all registered device interfaces via SNMP.',
  responses: {
    200: {
      content: { 'application/json': { schema: postPollInterfacesSchema } },
      description: 'Polling process completed',
    },
    500: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            error: z.string().optional(),
          }),
        },
      },
      description: 'Internal server error',
    },
  },
});

export const postPollSingleInterfaceRoute = createRoute({
  method: 'post',
  path: '/{id}/interfaces',
  summary: 'Poll network interfaces (Single device)',
  tags: ['SNMP Poll', 'Device Interfaces'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: postPollInterfacesSchema } },
      description: 'Polling process completed',
    },
    500: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            error: z.string().optional(),
          }),
        },
      },
      description: 'Internal server error',
    },
  },
});
