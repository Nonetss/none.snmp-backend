import { z } from '@hono/zod-openapi';

export const dnsServerSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().min(1).max(100).openapi({ example: 'Google Public DNS' }),
  ip: z.string().min(1).max(45).openapi({ example: '8.8.8.8' }),
});

export const createDnsServerSchema = dnsServerSchema.omit({ id: true });
export const updateDnsServerSchema = createDnsServerSchema.partial();

export const dnsServerResponseSchema = dnsServerSchema;
export const dnsServerListResponseSchema = z.array(dnsServerSchema);
