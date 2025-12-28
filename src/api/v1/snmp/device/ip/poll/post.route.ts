import { createRoute, z } from '@hono/zod-openapi';
import { postPollIpSchema } from './post.schema';

export const postPollIpRoute = createRoute({
  method: 'post',
  path: '/ip',
  summary: 'Poll device IP tables (All)',
  tags: ['SNMP Poll', 'Device IP'],
  responses: {
    200: {
      content: { 'application/json': { schema: postPollIpSchema } },
      description: 'Completed',
    },
    500: { description: 'Error' },
  },
});

export const postPollSingleIpRoute = createRoute({
  method: 'post',
  path: '/{id}/ip',
  summary: 'Poll device IP tables (Single)',
  tags: ['SNMP Poll', 'Device IP'],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      content: { 'application/json': { schema: postPollIpSchema } },
      description: 'Completed',
    },
    500: { description: 'Error' },
  },
});
