import { z } from '@hono/zod-openapi';

export const getComputerModelsQuerySchema = z.object({});

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
