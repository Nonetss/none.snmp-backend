import { z } from '@hono/zod-openapi';
import { PostAuthSchema } from '../post/post.schema';

export const ListAuthResponseSchema = z.array(
  PostAuthSchema.extend({
    id: z.number().openapi({ example: 1 }),
  }),
);
