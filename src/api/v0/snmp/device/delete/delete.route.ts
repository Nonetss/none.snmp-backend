import { createRoute, z } from '@hono/zod-openapi';

export const deleteDeviceRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete device',
  description: 'Removes a device from the database.',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': { schema: z.object({ message: z.string() }) },
      },
      description: 'Device deleted successfully',
    },
    404: { description: 'Device not found' },
  },
  tags: ['SNMP Device'],
});
