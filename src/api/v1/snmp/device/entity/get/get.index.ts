import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceEntityRoute } from './get.route';
import { getDeviceEntityHandler } from './get.handler';

const getDeviceEntityRouter = new OpenAPIHono();

getDeviceEntityRouter.openapi(getDeviceEntityRoute, getDeviceEntityHandler);

export default getDeviceEntityRouter;
