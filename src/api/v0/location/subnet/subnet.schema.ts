import { z } from '@hono/zod-openapi';

export const SubnetLocationStatusSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  cidr: z.string().openapi({ example: '192.168.1.0/24' }),
  name: z.string().nullable().openapi({ example: 'Management Subnet' }),
  hasLocation: z.boolean().openapi({
    description: 'True if any device in this subnet has a location',
  }),
  devices: z.array(
    z.object({
      id: z.number(),
      ipv4: z.string(),
      name: z.string().nullable(),
      hasLocation: z.boolean().openapi({
        description: 'True if this specific device has a location',
      }),
      location: z.any().nullable(),
    }),
  ),
});
