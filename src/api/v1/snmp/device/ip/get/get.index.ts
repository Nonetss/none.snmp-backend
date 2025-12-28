import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceIpRoute } from '@/api/v1/snmp/device/ip/get/get.route';
import { getDeviceIpHandler } from '@/api/v1/snmp/device/ip/get/get.handler';

const getDeviceIpRouter = new OpenAPIHono();
getDeviceIpRouter.openapi(getDeviceIpRoute, getDeviceIpHandler);
export default getDeviceIpRouter;
