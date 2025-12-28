import { z } from '@hono/zod-openapi';

export const deviceResourceSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'nginx' }),
  snmpId: z.string().openapi({ example: '1.3.6.1.4.1.2021.2.1.1.1' }),
  type: z.number().openapi({ example: 4 }),
  installDate: z
    .string()
    .nullable()
    .openapi({ example: '2025-12-28T10:00:00Z' }),
  lastSeen: z.string().openapi({ example: '2025-12-28T19:30:00Z' }),
});

export const getDeviceResourcesResponseSchema = z.array(deviceResourceSchema);
