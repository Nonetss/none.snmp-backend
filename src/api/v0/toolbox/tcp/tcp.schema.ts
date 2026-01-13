import { z } from '@hono/zod-openapi';

export const TcpCheckQuerySchema = z.object({
  ip: z
    .string()
    .openapi({ example: '10.0.0.1', description: 'Target IP address' }),
  port: z.string().openapi({ example: '80', description: 'Target TCP port' }),
  timeout: z
    .string()
    .optional()
    .openapi({ example: '2000', description: 'Timeout in milliseconds' }),
});

export const TcpCheckResponseSchema = z.object({
  open: z.boolean().openapi({ example: true }),
  time: z
    .union([z.number(), z.string()])
    .openapi({ example: 15, description: 'Response time in ms or "unknown"' }),
  ip: z.string(),
  port: z.number(),
});

export const PortScanSchema = z.object({
  ip: z.string().openapi({ example: '10.0.0.1' }),
  allPorts: z.boolean().optional().default(false).openapi({
    example: false,
    description: 'If true, scans 1-65535. If false or omitted, scans 1-1024.',
  }),
  timeout: z
    .number()
    .optional()
    .default(500)
    .openapi({ example: 500, description: 'Timeout per port in ms' }),
  concurrency: z.number().optional().default(100).openapi({
    example: 100,
    description: 'Number of simultaneous connection attempts',
  }),
});

export const PortScanResponseSchema = z.object({
  ip: z.string(),
  openPorts: z.array(
    z.object({
      port: z.number(),
      time: z.number(),
    }),
  ),
  totalScanned: z.number(),
});

export const SubnetPortScanSchema = z.object({
  subnet: z.string().openapi({ example: '172.19.64.0/24' }),
  allPorts: z.boolean().optional().default(false).openapi({
    example: false,
    description: 'If true, scans 1-65535. If false or omitted, scans 1-1024.',
  }),
  timeout: z
    .number()
    .optional()
    .default(500)
    .openapi({ example: 500, description: 'Timeout per port in ms' }),
  concurrency: z.number().optional().default(100).openapi({
    example: 100,
    description: 'Number of simultaneous connection attempts',
  }),
});

export const SubnetPortScanResponseSchema = z.object({
  subnet: z.string(),
  results: z.array(
    z.object({
      ip: z.string(),
      openPorts: z.array(
        z.object({
          port: z.number(),
          time: z.number(),
        }),
      ),
    }),
  ),
  totalIpsScanned: z.number(),
});
