import { z } from '@hono/zod-openapi';

export const getComputerModelsQuerySchema = z.object({
  excel: z.enum(['true', 'false']).optional().default('false').openapi({
    description: 'If true, returns the data as an Excel file instead of JSON',
    example: 'false',
  }),
});

export const getComputerModelsResponseSchema = z.array(
  z.object({
    model: z.string().nullable(),
    computers: z.array(
      z.object({
        id: z.number(),
        name: z.string().nullable(),
        ip: z.string().nullable().optional(),
      }),
    ),
  }),
);
