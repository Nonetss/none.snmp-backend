import { z } from '@hono/zod-openapi';

export const getKomodoServersResponseSchema = z.array(
  z.object({
    id: z.string(),
    type: z.literal('Server'),
    name: z.string(),
    template: z.boolean(),
    tags: z.array(z.string()),
    info: z.object({
      state: z.string(),
      region: z.string().url(),
      address: z.string().url(),
      external_address: z.string(),
      version: z.string(),
      send_unreachable_alerts: z.boolean(),
      send_cpu_alerts: z.boolean(),
      send_mem_alerts: z.boolean(),
      send_disk_alerts: z.boolean(),
      send_version_mismatch_alerts: z.boolean(),
      terminals_disabled: z.boolean(),
      container_exec_disabled: z.boolean(),
    }),
  }),
);
