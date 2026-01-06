import { z } from '@hono/zod-openapi';
import {
  InventoryPaginationSchema,
  ServiceInventorySchema,
} from '../inventory/inventory.schema';

export const ServiceFuzzySearchQuerySchema = InventoryPaginationSchema.extend({
  name: z.string().min(1).openapi({ example: 'nginx' }),
});

export const ServiceFuzzySearchResponseSchema = z.object({
  data: z.array(ServiceInventorySchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  }),
});
