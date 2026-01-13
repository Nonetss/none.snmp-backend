import { z } from '@hono/zod-openapi';

export const stackItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  serverId: z.string(),
  state: z.string(),
  status: z.string().optional(),
  services: z
    .array(
      z.object({
        service: z.string(),
        image: z.string(),
        update_available: z.boolean(),
      }),
    )
    .optional(),
});

export const stackListResponseSchema = z.array(stackItemSchema);
