import { z } from '@hono/zod-openapi';

export const getStatsResponseSchema = z.object({
  devices: z.object({
    totalManaged: z.number(),
    totalExternal: z.number(),
    up: z.number(),
    down: z.number(),
  }),
  topology: z.object({
    lldpConnections: z.number(),
    cdpConnections: z.number(),
    fdbConnections: z.number(),
    routingEdges: z.number(),
    resolvedLinks: z.number(),
  }),
  network: z.object({
    subnets: z.number(),
    totalIps: z.number(),
    activeArpEntries: z.number(),
  }),
  subnetsDistribution: z.array(
    z.object({
      subnetName: z.string(),
      cidr: z.string(),
      deviceCount: z.number(),
      upCount: z.number(),
      downCount: z.number(),
    }),
  ),
  snmpVersionDistribution: z.array(
    z.object({
      version: z.string(),
      deviceCount: z.number(),
    }),
  ),
  interfaceStatus: z.object({
    up: z.number(),
    down: z.number(),
    other: z.number(),
  }),
  topHubs: z.array(
    z.object({
      name: z.string(),
      connections: z.number(),
    }),
  ),
  activity: z.object({
    updatedNeighbors24h: z.number(),
    arpDiscoveries24h: z.number(),
  }),
});
