import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceIpRoute } from './get.route';
import { getDeviceIpHandler } from './get.handler';

const getDeviceIpRouter = new OpenAPIHono();
getDeviceIpRouter.openapi(getDeviceIpRoute, getDeviceIpHandler);
export default getDeviceIpRouter;
