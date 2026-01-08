import { z } from '@hono/zod-openapi';
import { ScanResultSchema } from '../rescan/rescan.schema';

export const PostScanSchema = z.object({
  cidr: z.string().openapi({ example: '10.10.1.0/24' }),
  subnetName: z.string().optional().openapi({ example: 'Main Subnet' }),
  createIfPingable: z.boolean().optional().openapi({ example: false }),
});

export const PostScanResponseSchema = z.object({
  message: z.string().openapi({ example: 'Scan completed' }),
  results: z.array(ScanResultSchema),
});
