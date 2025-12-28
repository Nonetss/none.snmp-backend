import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceAllRoute } from './get.route';
import { getDeviceAllHandler } from './get.handler';

const getDeviceAllRouter = new OpenAPIHono();
getDeviceAllRouter.openapi(getDeviceAllRoute, getDeviceAllHandler);
export default getDeviceAllRouter;
