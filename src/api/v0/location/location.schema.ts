import { z } from '@hono/zod-openapi';

export const LocationSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Data Center 1' }),
  description: z.string().nullable().openapi({ example: 'Main data center' }),
  parentId: z.number().nullable().openapi({ example: null }),
  deviceCount: z.number().optional().openapi({ example: 5 }),
});

export const CreateLocationSchema = LocationSchema.omit({ id: true });
export const UpdateLocationSchema = CreateLocationSchema.partial();
