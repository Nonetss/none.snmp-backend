import { z } from '@hono/zod-openapi';

const portSchema = z.object({
  IP: z.string(),
  PrivatePort: z.number(),
  PublicPort: z.number().nullable(),
  Type: z.enum(['tcp', 'udp']),
});

const statsSchema = z.object({
  name: z.string(),
  cpu_perc: z.string(),
  mem_perc: z.string(),
  mem_usage: z.string(),
  net_io: z.string(),
  block_io: z.string(),
  pids: z.string(),
});

export const containerItemSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  serverId: z.string().optional(),
  image: z.string().optional(),
  image_id: z.string().optional(),
  created: z.number().optional(),
  state: z.string(),
  status: z.string().optional(),
  network_mode: z.string().optional(),
  networks: z.array(z.string()).optional(),
  ports: z.array(portSchema).optional(),
  volumes: z.array(z.string()).optional(),
  stats: statsSchema.optional(),
});

export const containerListMetadataSchema = z.object({
  exists: z.boolean(),
  total_containers: z.number(),
  status: z.object({
    running: z.number(),
    paused: z.number(),
    restarting: z.number(),
    exited: z.number(),
    created: z.number(),
    dead: z.number(),
  }),
});

export const containerListResponseSchema = z.object({
  response: z.array(containerItemSchema),
  metadata: containerListMetadataSchema,
});
