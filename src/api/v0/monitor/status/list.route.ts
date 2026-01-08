import { createRoute, z } from '@hono/zod-openapi';
import { PortStatusListSchema } from './status.schema';

export const listPortStatusRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List port status history',
  tags: ['Monitor Status'],
  request: {
    query: z.object({
      ruleId: z.string().optional().openapi({ example: '1' }),
      deviceId: z.string().optional().openapi({ example: '1' }),
      limit: z.string().optional().default('100').openapi({ example: '100' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PortStatusListSchema,
        },
      },
      description: 'List of port status records',
    },
    500: {
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
      description: 'Internal Server Error',
    },
  },
});
