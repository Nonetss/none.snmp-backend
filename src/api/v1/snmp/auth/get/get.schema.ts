import { z } from '@hono/zod-openapi';
import { PostAuthSchema } from '../post/post.schema';

export const GetAuthParamsSchema = z.object({
  id: z.string().openapi({ example: '1' }),
});

export const GetAuthResponseSchema = PostAuthSchema.extend({
  id: z.number().openapi({ example: 1 }),
});
