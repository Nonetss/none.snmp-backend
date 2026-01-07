import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceSystemRoute } from './get.route';
import { getDeviceSystemHandler } from './get.handler';

const getDeviceSystemRouter = new OpenAPIHono();
getDeviceSystemRouter.openapi(getDeviceSystemRoute, getDeviceSystemHandler);
export default getDeviceSystemRouter;
