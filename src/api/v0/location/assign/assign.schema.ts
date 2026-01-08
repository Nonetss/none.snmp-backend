import { z } from '@hono/zod-openapi';

export const AssignLocationSchema = z.object({
  locationId: z.number().openapi({ example: 1 }),
  subnetIds: z
    .array(z.number())
    .optional()
    .openapi({ example: [1, 2] }),
  deviceIds: z
    .array(z.number())
    .optional()
    .openapi({ example: [1, 2, 3] }),
  force: z
    .boolean()
    .optional()
    .default(false)
    .openapi({
      example: false,
      description: 'Overwrite existing locations if true',
    }),
});

export const AssignLocationResponseSchema = z.object({
  message: z.string().openapi({ example: '15 devices assigned to location' }),
  count: z.number().openapi({ example: 15 }),
});
