import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceSearchRoute } from './get.route';
import { getDeviceSearchHandler } from './get.handler';

const getDeviceSearchRouter = new OpenAPIHono();

getDeviceSearchRouter.openapi(getDeviceSearchRoute, getDeviceSearchHandler);

export default getDeviceSearchRouter;
