import { z } from '@hono/zod-openapi';

export const InventoryPaginationSchema = z.object({
  page: z.coerce.number().optional().default(1).openapi({ example: 1 }),
  pageSize: z.coerce.number().optional().default(50).openapi({ example: 50 }),
});

export const ApplicationInventorySchema = z.object({
  name: z.string().openapi({ example: 'Google Chrome' }),
  devices: z.array(
    z.object({
      id: z.number(),
      name: z.string().nullable(),
      ipv4: z.string(),
    }),
  ),
});

export const ApplicationInventoryResponseSchema = z.object({
  data: z.array(ApplicationInventorySchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  }),
});
