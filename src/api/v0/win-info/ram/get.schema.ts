import { z } from '@hono/zod-openapi';

export const getComputerRamQuerySchema = z.object({
  minRam: z.string().optional().openapi({
    description: 'Minimum RAM in GB',
    example: '8',
  }),
  maxRam: z.string().optional().openapi({
    description: 'Maximum RAM in GB',
    example: '16',
  }),
  excel: z.enum(['true', 'false']).optional().default('false').openapi({
    description: 'If true, returns the data as an Excel file instead of JSON',
    example: 'false',
  }),
});

export const getComputerRamResponseSchema = z.array(
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
