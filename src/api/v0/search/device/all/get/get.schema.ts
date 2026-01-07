import { z } from '@hono/zod-openapi';
import { getDeviceSystemResponseSchema } from '@/api/v0/search/system/get/get.schema';
import { getDeviceInterfacesResponseSchema } from '@/api/v0/search/interface/get/get.schema';
import { getDeviceResourcesResponseSchema } from '@/api/v0/search/resource/get/get.schema';
import { getDeviceIpResponseSchema } from '@/api/v0/search/ip/get/get.schema';

export const getDeviceAllResponseSchema = z.object({
  system: getDeviceSystemResponseSchema,
  interfaces: getDeviceInterfacesResponseSchema,
  applications: getDeviceResourcesResponseSchema,
  network: getDeviceIpResponseSchema,
});
