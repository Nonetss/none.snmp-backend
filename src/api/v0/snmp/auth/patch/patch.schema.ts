import { z } from '@hono/zod-openapi';
import { PostAuthSchema } from '../post/post.schema';

export const PatchAuthParamsSchema = z.object({
  id: z.string().openapi({ example: '1' }),
});

export const PatchAuthBodySchema = PostAuthSchema.partial();

export const PatchAuthResponseSchema = z.object({
  message: z
    .string()
    .openapi({ example: 'Authentication updated successfully' }),
});
