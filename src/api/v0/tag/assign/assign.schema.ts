import { z } from '@hono/zod-openapi';

export const AssignTagsSchema = z.object({
  deviceIds: z
    .array(z.number())
    .openapi({ example: [1, 2], description: 'List of device IDs' }),
  tagIds: z
    .array(z.number())
    .openapi({ example: [3, 4], description: 'List of tag IDs' }),
});

export const UnassignTagsSchema = AssignTagsSchema;

export const TagAssignmentResponseSchema = z.object({
  message: z.string().openapi({ example: 'Tags assigned successfully' }),
});
