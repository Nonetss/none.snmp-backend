import { z } from '@hono/zod-openapi';

export const stackItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  template: z.boolean(),
  tags: z.array(z.string()),
  info: z.object({
    server_id: z.string(),
    files_on_host: z.boolean(),
    file_contents: z.boolean(),
    linked_repo: z.string(),
    git_provider: z.string(),
    repo: z.string(),
    branch: z.string(),
    repo_link: z.string(),
    state: z.string(),
    status: z.string(),
    services: z.array(
      z.object({
        service: z.string(),
        image: z.string(),
        update_available: z.boolean(),
      }),
    ),
    project_missing: z.boolean(),
    missing_files: z.array(z.string()),
    deployed_hash: z.string().nullable(),
    latest_hash: z.string().nullable(),
  }),
});

export const stackListResponseSchema = z.array(stackItemSchema);

export const stackListMetadataSchema = z.object({
  exists: z.boolean(),
  total_stacks: z.number(),
});

export const stackListResponse = z.object({
  response: stackListResponseSchema,
  metadata: stackListMetadataSchema,
});
