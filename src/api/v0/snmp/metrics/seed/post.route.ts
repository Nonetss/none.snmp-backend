import { createRoute } from '@hono/zod-openapi';
import { PostSeedSchema, PostSeedResponseSchema } from './post.schema';

export const postSeedRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Seed SNMP metrics from OID JSON documentation',
  description: 'Seed SNMP metrics from OID JSON documentation',
  tags: ['SNMP Metrics'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostSeedSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PostSeedResponseSchema,
        },
      },
      description: 'MIBs processed successfully',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
