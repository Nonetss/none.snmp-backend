import { z } from '@hono/zod-openapi';

export const getComputersByUserQuerySchema = z.object({
  username: z.string().openapi({ example: 'john.doe' }),
  excel: z.enum(['true', 'false']).optional().default('false').openapi({
    description: 'If true, returns the data as an Excel file instead of JSON',
    example: 'false',
  }),
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
