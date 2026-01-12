import { z } from '@hono/zod-openapi';

export const getComputersQuerySchema = z.object({
  excel: z.enum(['true', 'false']).optional().default('false').openapi({
    description: 'If true, returns the data as an Excel file instead of JSON',
    example: 'false',
  }),
});

export const getComputersResponseSchema = z.array(
  z.object({
    id: z.number(),
    Name: z.string().nullable(),
    Domain: z.string().nullable(),
    Manufacturer: z.string().nullable(),
    Model: z.string().nullable(),
    TotalPhysicalMemory: z.number().nullable(),
    ip: z.string().nullable().optional(),
  }),
);
