import { z } from '@hono/zod-openapi';

export const BaseBoardSchema = z.object({
  Product: z.string(),
  Manufacturer: z.string(),
  SerialNumber: z.string(),
});
export type BaseBoard = z.infer<typeof BaseBoardSchema>;

export const BiosSchema = z.object({
  Manufacturer: z.string(),
  SMBIOSBIOSVersion: z.string(),
  SerialNumber: z.string(),
});
export type Bios = z.infer<typeof BiosSchema>;

export const ComputerSystemSchema = z.object({
  Name: z.string(),
  Domain: z.string(),
  Manufacturer: z.string(),
  Model: z.string(),
  TotalPhysicalMemory: z.number(),
});
export type ComputerSystem = z.infer<typeof ComputerSystemSchema>;

export const ComputerSystemProductSchema = z.object({
  IdentifyingNumber: z.string(),
  Name: z.string(),
  Vendor: z.string(),
});
export type ComputerSystemProduct = z.infer<typeof ComputerSystemProductSchema>;

export const DiskDriveSchema = z.object({
  Model: z.string(),
  Size: z.union([z.number(), z.null()]),
  DeviceID: z.string(),
});
export type DiskDrive = z.infer<typeof DiskDriveSchema>;

export const InstalledApplicationSchema = z.object({
  DisplayName: z.string(),
  DisplayVersion: z.union([z.null(), z.string()]),
  Publisher: z.union([z.null(), z.string()]),
  InstallDate: z.union([z.null(), z.string()]),
});
export type InstalledApplication = z.infer<typeof InstalledApplicationSchema>;

export const NetworkAdapterConfigSchema = z.object({
  ServiceName: z.string(),
  DHCPEnabled: z.boolean(),
  Description: z.string(),
  Index: z.number(),
});
export type NetworkAdapterConfig = z.infer<typeof NetworkAdapterConfigSchema>;

export const NetworkIdentitySchema = z.object({
  Description: z.string(),
  MACAddress: z.string(),
  IPAddress: z.preprocess((val) => {
    if (Array.isArray(val)) {
      return val.find((ip: string) => ip.includes('.')) || val[0];
    }
    return val;
  }, z.string()),
});
export type NetworkIdentity = z.infer<typeof NetworkIdentitySchema>;

export const OperatingSystemSchema = z.object({
  Caption: z.string(),
  Version: z.string(),
  OSArchitecture: z.string(),
  InstallDate: z.string(),
});
export type OperatingSystem = z.infer<typeof OperatingSystemSchema>;

export const PhysicalMemorySchema = z.object({
  Capacity: z.number(),
  Speed: z.number(),
  DeviceLocator: z.string(),
});
export type PhysicalMemory = z.infer<typeof PhysicalMemorySchema>;

export const ProcessorSchema = z.object({
  Name: z.string(),
  MaxClockSpeed: z.number(),
  NumberOfCores: z.number(),
});
export type Processor = z.infer<typeof ProcessorSchema>;

export const RunningServiceSchema = z.object({
  Name: z.string(),
  DisplayName: z.union([z.null(), z.string()]),
  State: z.union([z.null(), z.string()]),
  StartMode: z.union([z.null(), z.string()]),
});
export type RunningService = z.infer<typeof RunningServiceSchema>;

const asArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (Array.isArray(val) ? val : [val]), z.array(schema));

const asObject = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (Array.isArray(val) ? val[0] : val), schema);

export const PostDataSchema = z.object({
  BIOS: asObject(BiosSchema),
  InstalledApplications: asArray(InstalledApplicationSchema),
  ComputerSystem: asObject(ComputerSystemSchema),
  BaseBoard: asObject(BaseBoardSchema),
  NetworkAdapterConfig: asArray(NetworkAdapterConfigSchema),
  ComputerSystemProduct: asObject(ComputerSystemProductSchema),
  Processor: asObject(ProcessorSchema),
  DiskDrive: asArray(DiskDriveSchema),
  NetworkIdentity: asArray(NetworkIdentitySchema),
  OperatingSystem: asObject(OperatingSystemSchema),
  PhysicalMemory: asArray(PhysicalMemorySchema),
  RunningServices: asArray(RunningServiceSchema).optional(),
});
export type PostData = z.infer<typeof PostDataSchema>;

export const postResponseSchema = z.object({
  status: z.string().default('success'),
  computerSystemId: z.number().int().positive(),
  date: z.string().default(new Date().toISOString()),
});
