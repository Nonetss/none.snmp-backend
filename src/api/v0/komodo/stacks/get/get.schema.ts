import { z } from '@hono/zod-openapi';

export const stackItemSchema = z.object({
  _id: z.object({
    $oid: z.string(),
  }),
  name: z.string(),
  description: z.string(),
  template: z.boolean(),
  tags: z.array(z.string()),
  info: z.object({
    missing_files: z.array(z.string()),
    deployed_project_name: z.string().nullable(),
    deployed_hash: z.string().nullable(),
    deployed_message: z.string().nullable(),
    deployed_contents: z
      .array(
        z.object({
          path: z.string(),
          contents: z.string(),
        }),
      )
      .nullable(),
    deployed_services: z
      .array(
        z.object({
          service_name: z.string(),
          container_name: z.string(),
          image: z.string(),
        }),
      )
      .nullable(),
    deployed_config: z.string().nullable(),
    latest_services: z
      .array(
        z.object({
          service_name: z.string(),
          container_name: z.string(),
          image: z.string(),
        }),
      )
      .nullable(),
    remote_contents: z.string().nullable(),
    remote_errors: z.string().nullable(),
    latest_hash: z.string().nullable(),
    latest_message: z.string().nullable(),
  }),
  config: z.object({
    server_id: z.string(),
    links: z.array(z.any()),
    project_name: z.string(),
    auto_pull: z.boolean(),
    run_build: z.boolean(),
    poll_for_updates: z.boolean(),
    auto_update: z.boolean(),
    auto_update_all_services: z.boolean(),
    destroy_before_deploy: z.boolean(),
    skip_secret_interp: z.boolean(),
    linked_repo: z.string(),
    git_provider: z.string(),
    git_https: z.boolean(),
    git_account: z.string(),
    repo: z.string(),
    branch: z.string(),
    commit: z.string(),
    clone_path: z.string(),
    reclone: z.boolean(),
    webhook_enabled: z.boolean(),
    webhook_secret: z.string(),
    webhook_force_deploy: z.boolean(),
    files_on_host: z.boolean(),
    run_directory: z.string(),
    file_paths: z.array(z.string()),
    env_file_path: z.string(),
    additional_env_files: z.array(z.string()),
    config_files: z.array(z.any()),
    send_alerts: z.boolean(),
    registry_provider: z.string(),
    registry_account: z.string(),
    pre_deploy: z.object({
      path: z.string(),
      command: z.string(),
    }),
    post_deploy: z.object({
      path: z.string(),
      command: z.string(),
    }),
    extra_args: z.array(z.string()),
    build_extra_args: z.array(z.string()),
    ignore_services: z.array(z.string()),
    file_contents: z.string(),
    environment: z.string(),
  }),
  base_permission: z.string(),
  updated_at: z.number(),
});

export const stackResponseSchema = stackItemSchema;

export const stackMetadataSchema = z.object({
  exists: z.boolean(),
});

export const stackResponse = z.object({
  response: stackResponseSchema,
  metadata: stackMetadataSchema,
});
