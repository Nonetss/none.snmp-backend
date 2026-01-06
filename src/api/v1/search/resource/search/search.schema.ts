import { z } from '@hono/zod-openapi';
import {
  InventoryPaginationSchema,
  ApplicationInventorySchema,
} from '../inventory/inventory.schema';

export const ResourceFuzzySearchQuerySchema = InventoryPaginationSchema.extend({
  name: z.string().min(1).openapi({ example: 'google' }),
});

export const ResourceFuzzySearchResponseSchema = z.object({
  data: z.array(ApplicationInventorySchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  }),
});
