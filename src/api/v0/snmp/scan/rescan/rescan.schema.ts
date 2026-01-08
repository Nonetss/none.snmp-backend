import { z } from '@hono/zod-openapi';

export const RescanSchema = z.object({
  id: z.coerce.number().openapi({ example: 1 }),
});

export const ScanResultSchema = z.object({
  ip: z.string().openapi({ example: '10.10.1.5' }),
  status: z
    .enum(['success', 'failed', 'offline', 'pingable'])
    .openapi({ example: 'success' }),
  authId: z.number().optional().openapi({ example: 1 }),
  deviceId: z.number().optional().openapi({ example: 12 }),
});

export const RescanResponseSchema = z.object({
  message: z.string().openapi({ example: 'Scan completed' }),
  results: z.array(ScanResultSchema),
});
