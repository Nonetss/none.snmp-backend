import { createRoute } from '@hono/zod-openapi';
import { TcpCheckQuerySchema, TcpCheckResponseSchema } from '../monitor.schema';

export const getTcpCheckRoute = createRoute({
  method: 'get',
  path: '/tcp',
  summary: 'Check if a TCP port is open (nc -vz emu)',
  tags: ['Monitor'],
  request: {
    query: TcpCheckQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: TcpCheckResponseSchema,
        },
      },
      description: 'Port check result',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
