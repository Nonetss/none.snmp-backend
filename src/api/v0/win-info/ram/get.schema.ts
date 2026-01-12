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
