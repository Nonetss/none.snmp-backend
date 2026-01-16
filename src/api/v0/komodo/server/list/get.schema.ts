import { z } from '@hono/zod-openapi';

export const listKomodoServersResponseSchema = z.array(
  z.object({
    id: z.string(),
    _id: z.object({
      $oid: z.string(),
    }),
    name: z.string(),
    description: z.string(),
    template: z.boolean(),
    tags: z.array(z.string()),
    info: z.null(),
    config: z.object({
      address: z.string().url(),
      external_address: z.string(),
      region: z.string(),
      enabled: z.boolean(),
      timeout_seconds: z.number(),
      passkey: z.string(),
      ignore_mounts: z.array(z.string()),
      stats_monitoring: z.boolean(),
      auto_prune: z.boolean(),
      links: z.array(z.string()),
      send_unreachable_alerts: z.boolean(),
      send_cpu_alerts: z.boolean(),
      send_mem_alerts: z.boolean(),
      send_disk_alerts: z.boolean(),
      send_version_mismatch_alerts: z.boolean(),
      cpu_warning: z.number(),
      cpu_critical: z.number(),
      mem_warning: z.number(),
      mem_critical: z.number(),
      disk_warning: z.number(),
      disk_critical: z.number(),
      maintenance_windows: z.array(z.unknown()),
    }),
    base_permission: z.string(),
    updated_at: z.number(),
  }),
);

export const listKomodoServersMetadataSchema = z.object({
  exists: z.boolean(),
  total_servers: z.number(),
  total_tags: z.number(),
  tags: z.array(z.string()),
});

export const listKomodoResponseSchema = z.object({
  response: listKomodoServersResponseSchema,
  metadata: listKomodoServersMetadataSchema,
});
