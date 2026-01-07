import { z } from '@hono/zod-openapi';

export const deviceInterfaceSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  ifIndex: z.number().openapi({ example: 1 }),
  ifDescr: z
    .string()
    .nullable()
    .openapi({ example: 'Intel Corporation Ethernet Connection' }),
  ifName: z.string().nullable().openapi({ example: 'eth0' }),
  ifType: z.number().nullable().openapi({ example: 6 }),
  ifMtu: z.number().nullable().openapi({ example: 1500 }),
  ifSpeed: z.string().nullable().openapi({ example: '1000000000' }),
  ifPhysAddress: z
    .string()
    .nullable()
    .openapi({ example: '00:1A:2B:3C:4D:5E' }),
  updatedAt: z.string().openapi({ example: '2025-12-28T19:30:00Z' }),
});

export const getDeviceInterfacesResponseSchema = z.array(deviceInterfaceSchema);
