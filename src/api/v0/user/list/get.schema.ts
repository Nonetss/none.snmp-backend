import { z } from '@hono/zod-openapi';

export const getUserListResponseSchema = z.array(
  z.object({
    id: z.number(),
    username: z.string().nullable(),
  }),
);
