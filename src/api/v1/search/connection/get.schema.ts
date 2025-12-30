import { z } from '@hono/zod-openapi';

export const connectionSearchSchema = z.object({
  query: z.string().openapi({
    description: 'IP or MAC address to search for',
    example: '192.168.1.50',
  }),
});

export const connectionResultSchema = z.object({
  switchId: z.number(),
  switchName: z.string().nullable(),
  switchIp: z.string(),
  switchLocation: z.string().nullable(),
  switchDescription: z.string().nullable(),
  bridgePort: z.number(),
  interface: z
    .object({
      id: z.number(),
      ifIndex: z.number(),
      ifName: z.string().nullable(),
      ifDescr: z.string().nullable(),
      ifType: z.number().nullable(),
      ifMtu: z.number().nullable(),
      ifSpeed: z.string().nullable(),
      ifPhysAddress: z.string().nullable(),
    })
    .nullable(),
  macAddress: z.string(),
  ipAddress: z.string().nullable(),
  status: z.number().nullable(),
  lastSeen: z.string(),
});

export const connectionSearchResponseSchema = z.array(connectionResultSchema);
