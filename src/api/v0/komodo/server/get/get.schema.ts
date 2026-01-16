import { z } from '@hono/zod-openapi';

export const getKomodoServerResponse = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  template: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  state: z.string().optional(),
  config: z
    .object({
      address: z.string().url(),
      external_address: z.string().optional(),
      region: z.string().optional(),
      enabled: z.boolean().optional(),
      timeout_seconds: z.number().optional(),
      stats_monitoring: z.boolean().optional(),
      auto_prune: z.boolean().optional(),
      send_unreachable_alerts: z.boolean().optional(),
      send_cpu_alerts: z.boolean().optional(),
      send_mem_alerts: z.boolean().optional(),
      send_disk_alerts: z.boolean().optional(),
      cpu_warning: z.number().optional(),
      cpu_critical: z.number().optional(),
      mem_warning: z.number().optional(),
      mem_critical: z.number().optional(),
      disk_warning: z.number().optional(),
      disk_critical: z.number().optional(),
    })
    .optional(),
  updated_at: z.number().optional(),
  stacks: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
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
      }),
    )
    .optional(),
  containers: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        image: z.string().optional(),
        state: z.string(),
        status: z.string().optional(),
        created: z.number().optional(),
        image_id: z.string().optional(),
      }),
    )
    .optional(),
});

export const getKomodoServerMetadataSchema = z.object({
  exists: z.boolean(),
  total_stacks: z.number(),
  total_containers: z.number(),
  total_tags: z.number(),
  tags: z.array(z.string()),
});

export const getKomodoServerResponseSchema = z.object({
  response: getKomodoServerResponse,
  metadata: getKomodoServerMetadataSchema,
});
