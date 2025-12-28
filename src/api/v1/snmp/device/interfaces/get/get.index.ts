import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceInterfacesRoute } from '@/api/v1/snmp/device/interfaces/get/get.route';
import { getDeviceInterfacesHandler } from '@/api/v1/snmp/device/interfaces/get/get.handler';

const getDeviceInterfacesRouter = new OpenAPIHono();

getDeviceInterfacesRouter.openapi(
  getDeviceInterfacesRoute,
  getDeviceInterfacesHandler,
);

export default getDeviceInterfacesRouter;
