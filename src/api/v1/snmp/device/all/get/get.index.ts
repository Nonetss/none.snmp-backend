import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceAllRoute } from '@/api/v1/snmp/device/all/get/get.route';
import { getDeviceAllHandler } from '@/api/v1/snmp/device/all/get/get.handler';

const getDeviceAllRouter = new OpenAPIHono();
getDeviceAllRouter.openapi(getDeviceAllRoute, getDeviceAllHandler);
export default getDeviceAllRouter;
