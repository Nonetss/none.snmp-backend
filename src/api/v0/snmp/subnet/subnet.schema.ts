import { z } from '@hono/zod-openapi';

export const SubnetSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  cidr: z.string().openapi({ example: '10.10.1.0/24' }),
  name: z.string().nullable().openapi({ example: 'Main Office' }),
  deviceCount: z.number().openapi({ example: 5 }),
  scanPingable: z.boolean().openapi({ example: false }),
});

export const CreateSubnetSchema = z.object({
  cidr: z.string().openapi({ example: '10.10.1.0/24' }),
  name: z.string().optional().openapi({ example: 'Main Office' }),
  scanPingable: z.boolean().optional().openapi({ example: false }),
});

export const UpdateSubnetSchema = z.object({
  cidr: z.string().optional().openapi({ example: '10.10.1.0/24' }),
  name: z.string().optional().openapi({ example: 'Main Office' }),
  scanPingable: z.boolean().optional().openapi({ example: false }),
});

export const SubnetIdParamSchema = z.object({
  id: z.coerce
    .number()
    .openapi({ param: { name: 'id', in: 'path' }, example: 1 }),
});
