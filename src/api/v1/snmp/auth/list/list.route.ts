import { createRoute } from '@hono/zod-openapi';
import { ListAuthResponseSchema } from './list.schema';

export const listAuthRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ListAuthResponseSchema,
        },
      },
      description: 'List of SNMP authentications',
    },
  },
  tags: ['SNMP Authentication'],
});
