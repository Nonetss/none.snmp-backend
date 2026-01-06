import { z } from '@hono/zod-openapi';

export const ipAddrSchema = z.object({
  ip: z.string().openapi({ example: '192.168.1.1' }),
  ifIndex: z.number().openapi({ example: 1 }),
  netmask: z.string().openapi({ example: '255.255.255.0' }),
  broadcast: z.string().openapi({ example: '192.168.1.255' }),
  time: z.string().openapi({ example: '2025-12-28T19:30:00Z' }),
});

export const arpSchema = z.object({
  ifIndex: z.number().openapi({ example: 1 }),
  physAddress: z.string().openapi({ example: '00:1A:2B:3C:4D:5E' }),
  netAddress: z.string().openapi({ example: '192.168.1.50' }),
  type: z.number().openapi({ example: 3 }),
  time: z.string().openapi({ example: '2025-12-28T19:30:00Z' }),
});

export const getDeviceIpResponseSchema = z.object({
  addresses: z.array(ipAddrSchema),
  arpTable: z.array(arpSchema),
});
