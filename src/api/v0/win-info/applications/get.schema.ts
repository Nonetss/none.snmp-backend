import { z } from '@hono/zod-openapi';

export const getComputerApplicationsQuerySchema = z.object({
  excel: z.enum(['true', 'false']).optional().default('false').openapi({
    description: 'If true, returns the data as an Excel file instead of JSON',
    example: 'false',
  }),
});

export const getComputerApplicationsResponseSchema = z.array(
  z.object({
    application: z.string(),
    publisher: z.string().nullable(),
    version: z.string().nullable(),
    computers: z.array(
      z.object({
        id: z.number(),
        name: z.string().nullable(),
      }),
    ),
  }),
);
