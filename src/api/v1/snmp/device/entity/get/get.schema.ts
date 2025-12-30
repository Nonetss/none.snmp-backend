import { z } from '@hono/zod-openapi';

export const getDeviceEntityResponseSchema = z.array(
  z.object({
    id: z.number(),
    physicalIndex: z.number(),
    descr: z.string().nullable(),
    vendorType: z.string().nullable(),
    containedIn: z.number().nullable(),
    class: z.number().nullable(),
    parentRelPos: z.number().nullable(),
    name: z.string().nullable(),
    hardwareRev: z.string().nullable(),
    firmwareRev: z.string().nullable(),
    softwareRev: z.string().nullable(),
    serialNum: z.string().nullable(),
    mfgName: z.string().nullable(),
    modelName: z.string().nullable(),
    alias: z.string().nullable(),
    assetId: z.string().nullable(),
    isFru: z.number().nullable(),
    mfgDate: z.string().nullable(),
    updatedAt: z.string().nullable(),
  }),
);
