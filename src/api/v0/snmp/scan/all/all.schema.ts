import { z } from '@hono/zod-openapi';

export const ScanAllResponseSchema = z.object({
  message: z.string().openapi({ example: 'All subnets scan completed' }),
  results: z
    .array(z.any())
    .openapi({ description: 'List of results by subnet' }),
});
