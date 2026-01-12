import { z } from '@hono/zod-openapi';

export const getServiceNamesQuerySchema = z.object({});

export const getServiceNamesResponseSchema = z.array(z.string());
