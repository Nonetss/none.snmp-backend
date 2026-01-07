import { z } from '@hono/zod-openapi';

export const InventoryPaginationSchema = z.object({
  page: z.coerce.number().optional().default(1).openapi({ example: 1 }),
  pageSize: z.coerce.number().optional().default(50).openapi({ example: 50 }),
});

export const ServiceInventorySchema = z.object({
  name: z.string().openapi({ example: 'nginx' }),
  devices: z.array(
    z.object({
      id: z.number(),
      name: z.string().nullable(),
      ipv4: z.string(),
    }),
  ),
});

export const ServiceInventoryResponseSchema = z.object({
  data: z.array(ServiceInventorySchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  }),
});
