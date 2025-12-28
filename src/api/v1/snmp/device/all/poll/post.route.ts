import { createRoute, z } from '@hono/zod-openapi';

export const postPollAllRoute = createRoute({
  method: 'post',
  path: '/all',
  summary: 'Poll all data types (All devices)',
  tags: ['SNMP Poll'],
  responses: { 200: { description: 'OK' }, 500: { description: 'Error' } },
});

export const postPollSingleAllRoute = createRoute({
  method: 'post',
  path: '/{id}/all',
  summary: 'Poll all data types (Single device)',
  tags: ['SNMP Poll'],
  request: { params: z.object({ id: z.string() }) },
  responses: { 200: { description: 'OK' }, 500: { description: 'Error' } },
});
