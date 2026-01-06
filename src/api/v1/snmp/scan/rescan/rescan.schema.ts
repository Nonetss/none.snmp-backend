import { z } from '@hono/zod-openapi';

export const RescanSchema = z.object({
  id: z.coerce
    .number()
    .openapi({ param: { name: 'id', in: 'path' }, example: 1 }),
});

export const RescanResponseSchema = z.object({
  message: z.string().openapi({ example: 'Scan completed' }),
  results: z.array(
    z.object({
      ip: z.string(),
      status: z.enum(['success', 'failed', 'offline']),
      authId: z.number().optional(),
    }),
  ),
});
