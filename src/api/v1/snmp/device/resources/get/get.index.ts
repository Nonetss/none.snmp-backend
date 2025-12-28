import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceResourcesRoute } from '@/api/v1/snmp/device/resources/get/get.route';
import { getDeviceResourcesHandler } from '@/api/v1/snmp/device/resources/get/get.handler';

const getDeviceResourcesRouter = new OpenAPIHono();

getDeviceResourcesRouter.openapi(
  getDeviceResourcesRoute,
  getDeviceResourcesHandler,
);

export default getDeviceResourcesRouter;
