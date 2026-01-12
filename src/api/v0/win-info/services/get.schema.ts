import { z } from '@hono/zod-openapi';

export const getComputerServicesQuerySchema = z.object({});

export const getComputerServicesResponseSchema = z.array(
  z.object({
    service: z.string(),
    displayName: z.string().nullable(),
    status: z.string().nullable(),
    startType: z.string().nullable(),
    computers: z.array(
      z.object({
        id: z.number(),
        name: z.string().nullable(),
      }),
    ),
  }),
);
