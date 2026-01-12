import { createRoute } from '@hono/zod-openapi';
import { listDevicesResponseSchema } from './list.schema';
import { ExcelQuerySchema } from '@/api/v0/common.schema';

export const listDevicesRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Search'],
  summary: 'List all managed devices',
  request: {
    query: ExcelQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: listDevicesResponseSchema,
        },
      },
      description: 'List of managed devices',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
