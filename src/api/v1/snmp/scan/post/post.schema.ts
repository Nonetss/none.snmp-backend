import { z } from '@hono/zod-openapi';

export const PostScanSchema = z.object({
  cidr: z.string().openapi({ example: '10.10.1.0/24' }),
  subnetName: z.string().optional().openapi({ example: 'Main Subnet' }),
});

export const PostScanResponseSchema = z.object({
  message: z.string().openapi({ example: 'Scan completed' }),
  results: z.array(
    z.object({
      ip: z.string(),
      status: z.enum(['success', 'failed', 'offline']),
      authId: z.number().optional(),
    }),
  ),
});
