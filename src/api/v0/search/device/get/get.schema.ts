import { z } from '@hono/zod-openapi';

export const deviceDetailedResultSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  ipv4: z.string(),
  snmpAuthId: z.number().nullable(),
  subnetId: z.number().nullable(),
  locationId: z.number().nullable(),
  subnet: z.any().nullable(),
  snmpAuth: z.any().nullable(),
  location: z.any().nullable(),
  system: z
    .object({
      id: z.number(),
      deviceId: z.number(),
      sysDescr: z.string().nullable(),
      sysUpTime: z.string().nullable(),
      sysContact: z.string().nullable(),
      sysName: z.string().nullable(),
      sysLocation: z.string().nullable(),
      sysServices: z.number().nullable(),
    })
    .nullable(),
  interfaces: z.array(z.any()),
  ipSnmp: z
    .object({
      addrEntries: z.array(z.any()),
      netToMediaEntries: z.array(z.any()),
    })
    .nullable(),
  neighbor_discovery: z.object({
    outbound: z.array(z.any()),
    inbound: z.array(z.any()),
  }),
  routes: z.array(z.any()),
  physicalEntities: z.array(z.any()),
  resources: z.array(z.any()),
  applications: z.array(z.any()),
  services: z.array(z.any()),
  bridge: z.object({
    base: z.any().nullable(),
    ports: z.array(z.any()),
    fdb: z.array(z.any()),
    fdbQ: z.array(z.any()),
    vlans: z.array(z.any()),
  }),
  hikvision: z.any().nullable(),
});

export const getDeviceSearchResponseSchema = z.array(
  deviceDetailedResultSchema,
);
