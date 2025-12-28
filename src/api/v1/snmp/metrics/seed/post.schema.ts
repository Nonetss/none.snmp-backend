import { z } from '@hono/zod-openapi';

export const PostSeedSchema = z.object({});

export const PostSeedResponseSchema = z.object({
  message: z.string(),
  mibsProcessed: z.array(z.string()),
});
