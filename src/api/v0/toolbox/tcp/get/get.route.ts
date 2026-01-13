import { createRoute } from '@hono/zod-openapi';
import { TcpCheckQuerySchema, TcpCheckResponseSchema } from '../tcp.schema';

export const getTcpCheckRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Check if a TCP port is open (nc -vz emu)',
  tags: ['Toolbox'],
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
