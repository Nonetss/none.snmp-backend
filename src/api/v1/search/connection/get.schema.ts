import { z } from '@hono/zod-openapi';

export const connectionSearchSchema = z.object({
  query: z.string().openapi({
    description: 'IP or MAC address to search for',
    example: '192.168.1.50',
  }),
});

export const connectionResultSchema = z.object({
  deviceId: z.number(),
  deviceName: z.string().nullable(),
  deviceIp: z.string(),
  ifIndex: z.number(),
  ifName: z.string().nullable(),
  ifDescr: z.string().nullable(),
  macAddress: z.string(),
  ipAddress: z.string(),
  type: z.number(),
  lastSeen: z.string(),
});

export const connectionSearchResponseSchema = z.array(connectionResultSchema);
