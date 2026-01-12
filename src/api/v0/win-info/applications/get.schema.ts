import { z } from '@hono/zod-openapi';

export const getComputerApplicationsQuerySchema = z.object({});

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
