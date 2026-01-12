import { z } from '@hono/zod-openapi';

export const getComputersByServiceQuerySchema = z.object({
  serviceName: z.string().openapi({
    description: 'Name or DisplayName of the service to search for',
    example: 'wuauserv',
  }),
  running: z.enum(['true', 'false']).default('true').openapi({
    description:
      "Search for computers that have (true) or don't have (false) the service running",
    example: 'true',
  }),
});

export const getComputersByServiceResponseSchema = z.array(
  z.object({
    id: z.number(),
    Name: z.string().nullable(),
    Domain: z.string().nullable(),
    Manufacturer: z.string().nullable(),
    Model: z.string().nullable(),
    ip: z.string().nullable().optional(),
  }),
);
