import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceSystemRoute } from '@/api/v1/snmp/device/system/get/get.route';
import { getDeviceSystemHandler } from '@/api/v1/snmp/device/system/get/get.handler';

const getDeviceSystemRouter = new OpenAPIHono();
getDeviceSystemRouter.openapi(getDeviceSystemRoute, getDeviceSystemHandler);
export default getDeviceSystemRouter;
