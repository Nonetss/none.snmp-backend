import { z } from '@hono/zod-openapi';

export const connectionSearchSchema = z.object({
  mac: z.string().optional().openapi({
    description: 'MAC address to search for',
    example: '00:11:22:33:44:55',
  }),
  ip: z.string().optional().openapi({
    description: 'IP address to search for',
    example: '192.168.1.50',
  }),
});

export const connectionResultSchema = z.object({
  switchId: z.number(),
  switchName: z.string().nullable(),
  switchIp: z.string(),
  switchLocation: z.string().nullable(),
  bridgePort: z.number().nullable(),
  resolvedBy: z.enum(['LLDP', 'CDP', 'FDB']),
  portMacCount: z.number().openapi({
    description:
      'Total number of MAC addresses learned on this port. Low numbers (1-2) usually indicate an access port.',
  }),
  isMostLikely: z.boolean().openapi({
    description:
      'True if this is the port with the fewest MAC addresses, likely being the physical connection point.',
  }),
  interface: z
    .object({
      ifName: z.string().nullable(),
      ifDescr: z.string().nullable(),
      ifSpeed: z.string().nullable(),
      ifType: z.string().nullable(),
    })
    .nullable(),
  macAddress: z.string(),
  ipAddress: z.string().nullable(),
  lastSeen: z.string(),
});

export const connectionSearchResponseSchema = z.array(connectionResultSchema);
