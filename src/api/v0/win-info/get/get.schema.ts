import { z } from '@hono/zod-openapi';
import {
  BiosSchema,
  InstalledApplicationSchema,
  ComputerSystemSchema,
  BaseBoardSchema,
  NetworkAdapterConfigSchema,
  ComputerSystemProductSchema,
  ProcessorSchema,
  DiskDriveSchema,
  NetworkIdentitySchema,
  OperatingSystemSchema,
  PhysicalMemorySchema,
} from '../post/post.schema';

export const getWinInfoQuerySchema = z.object({
  name: z.string().optional().openapi({ example: 'DESKTOP-123' }),

  ip: z.string().optional().openapi({ example: '192.168.1.10' }),

  date: z.string().optional().openapi({
    description:
      'Specific date in YYYY-MM-DD format. If omitted, returns latest.',
    example: '2023-01-01',
  }),

  tables: z.string().optional().openapi({
    description:
      'Comma separated list of tables to include. Available tables: BIOS, BaseBoard, ComputerSystemProduct, DiskDrive, InstalledApplications, NetworkIdentity, NetworkAdapterConfig, OperatingSystem, PhysicalMemory, Processor, RunningServices',
    example: 'BIOS,DiskDrive',
  }),

  excel: z.enum(['true', 'false']).optional().default('false').openapi({
    description: 'If true, returns the data as an Excel file instead of JSON',
    example: 'false',
  }),
});

export const getWinInfoResponseSchema = z.object({
  computerSystem: ComputerSystemSchema.extend({
    id: z.number(),
  }),

  date: z.string(),

  data: z.object({
    BIOS: BiosSchema.optional(),
    BaseBoard: BaseBoardSchema.optional(),
    ComputerSystemProduct: ComputerSystemProductSchema.optional(),
    DiskDrive: z.array(DiskDriveSchema).optional(),
    InstalledApplications: z.array(InstalledApplicationSchema).optional(),
    NetworkIdentity: z.array(NetworkIdentitySchema).optional(),
    NetworkAdapterConfig: z.array(NetworkAdapterConfigSchema).optional(),
    OperatingSystem: OperatingSystemSchema.optional(),
    PhysicalMemory: z.array(PhysicalMemorySchema).optional(),
    Processor: ProcessorSchema.optional(),
    RunningServices: z
      .array(
        z.object({
          Name: z.string(),
          DisplayName: z.string().nullable(),
          Status: z.string().nullable(),
          StartType: z.string().nullable(),
        }),
      )
      .optional(),
  }),
});
