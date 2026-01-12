import { z } from '@hono/zod-openapi';

export const getComputersQuerySchema = z.object({});

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
