import { z } from '@hono/zod-openapi';

export const DeleteAuthParamsSchema = z.object({
  id: z.string().openapi({ example: '1' }),
});

export const DeleteAuthResponseSchema = z.object({
  message: z
    .string()
    .openapi({ example: 'Authentication deleted successfully' }),
});
