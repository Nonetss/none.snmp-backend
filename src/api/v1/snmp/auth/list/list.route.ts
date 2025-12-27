import { createRoute } from '@hono/zod-openapi';
import { ListAuthResponseSchema } from './list.schema';

export const listAuthRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List SNMP authentications',
  description:
    'Retrieves a list of all SNMP authentication configurations stored in the system.',
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
