import { z } from '@hono/zod-openapi';

export const getApplicationNamesQuerySchema = z.object({});

export const getApplicationNamesResponseSchema = z.array(z.string());
