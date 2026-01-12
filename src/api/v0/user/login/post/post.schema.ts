import { z } from '@hono/zod-openapi';

export const postLoginSchema = z.object({
  username: z.string().openapi({ example: 'john.doe' }),
  computerName: z.string().openapi({ example: 'DESKTOP-ABC' }),
});

export const postLoginResponseSchema = z.object({
  status: z.string().default('success'),
  loginId: z.number(),
  userId: z.number(),
  computerId: z.number(),
});
