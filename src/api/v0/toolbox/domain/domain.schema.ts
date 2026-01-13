import { z } from '@hono/zod-openapi';

export const domainSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  domain: z.string().min(1).max(100).openapi({ example: 'google.com' }),
});

export const createDomainSchema = domainSchema.omit({ id: true });
export const updateDomainSchema = createDomainSchema.partial();

export const domainResponseSchema = domainSchema;
export const domainListResponseSchema = z.array(domainSchema);
