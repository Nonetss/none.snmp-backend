import { z } from '@hono/zod-openapi';

export const getComputerStorageQuerySchema = z.object({
  minStorage: z.string().optional().openapi({
    description: 'Minimum total storage in GB',
    example: '250',
  }),
  maxStorage: z.string().optional().openapi({
    description: 'Maximum total storage in GB',
    example: '1000',
  }),
  excel: z.enum(['true', 'false']).optional().default('false').openapi({
    description: 'If true, returns the data as an Excel file instead of JSON',
    example: 'false',
  }),
});

export const getComputerStorageResponseSchema = z.array(
  z.object({
    id: z.number(),
    Name: z.string().nullable(),
    Domain: z.string().nullable(),
    Manufacturer: z.string().nullable(),
    Model: z.string().nullable(),
    totalStorageGB: z.number(),
    ip: z.string().nullable().optional(),
  }),
);
