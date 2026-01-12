import { z } from '@hono/zod-openapi';

export const getComputersByUserQuerySchema = z.object({
  username: z.string().openapi({ example: 'john.doe' }),
});

export const getComputersByUserResponseSchema = z.object({
  username: z.string(),
  computers: z.array(
    z.object({
      id: z.number(),
      name: z.string().nullable(),
      model: z.string().nullable(),
      lastLoginAt: z.string().nullable(),
    }),
  ),
});
