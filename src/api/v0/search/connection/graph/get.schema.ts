import { z } from '@hono/zod-openapi';

export const nodeSchema = z
  .object({
    id: z.string().openapi({ example: 'device-1' }),
    label: z.string().openapi({ example: 'Switch-Core' }),
    ipv4: z.string().optional().openapi({ example: '192.168.1.1' }),
    type: z.string().optional().openapi({ example: 'switch' }),
  })
  .openapi('Node');

export const linkSchema = z
  .object({
    source: z.string().openapi({ example: 'device-1' }),
    target: z.string().openapi({ example: 'device-2' }),
    sourcePort: z
      .string()
      .optional()
      .openapi({ example: 'GigabitEthernet0/1' }),
    targetPort: z
      .string()
      .optional()
      .openapi({ example: 'GigabitEthernet0/2' }),
    protocol: z.enum(['LLDP', 'CDP']).openapi({ example: 'LLDP' }),
  })
  .openapi('Link');

export const connectionGraphResponseSchema = z
  .object({
    nodes: z.array(nodeSchema),
    links: z.array(linkSchema),
  })
  .openapi('ConnectionGraphResponse');
