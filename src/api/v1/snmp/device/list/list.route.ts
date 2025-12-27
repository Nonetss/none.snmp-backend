import { createRoute, z } from '@hono/zod-openapi';
import { ListDeviceResponseSchema } from '../device.schema';

export const listDeviceRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List devices',
  description: 'Retrieves all discovered devices. Can be filtered by subnetId.',
  request: {
    query: z.object({
      subnetId: z.string().optional().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ListDeviceResponseSchema,
        },
      },
      description: 'List of devices',
    },
  },
  tags: ['SNMP Device'],
});
