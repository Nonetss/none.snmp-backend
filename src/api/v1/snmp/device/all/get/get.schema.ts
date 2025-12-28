import { z } from '@hono/zod-openapi';
import { getDeviceSystemResponseSchema } from '../../system/get/get.schema';
import { getDeviceInterfacesResponseSchema } from '../../interfaces/get/get.schema';
import { getDeviceResourcesResponseSchema } from '../../resources/get/get.schema';
import { getDeviceIpResponseSchema } from '../../ip/get/get.schema';

export const getDeviceAllResponseSchema = z.object({
  system: getDeviceSystemResponseSchema,
  interfaces: getDeviceInterfacesResponseSchema,
  applications: getDeviceResourcesResponseSchema,
  network: getDeviceIpResponseSchema,
});
