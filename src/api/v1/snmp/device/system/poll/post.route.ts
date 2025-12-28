import { createRoute, z } from '@hono/zod-openapi';

export const postPollSystemRoute = createRoute({
  method: 'post',
  path: '/system',
  summary: 'Poll system info (All)',
  tags: ['SNMP Poll', 'Device System'],
  responses: { 200: { description: 'OK' }, 500: { description: 'Error' } },
});

export const postPollSingleSystemRoute = createRoute({
  method: 'post',
  path: '/{id}/system',
  summary: 'Poll system info (Single)',
  tags: ['SNMP Poll', 'Device System'],
  request: { params: z.object({ id: z.string() }) },
  responses: { 200: { description: 'OK' }, 500: { description: 'Error' } },
});
