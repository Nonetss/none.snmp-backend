import { OpenAPIHono } from '@hono/zod-openapi';
import { getMonitorPortGroupRoute } from './get.route';
import { getMonitorPortGroupHandler } from './get.handler';

const getRouter = new OpenAPIHono();
getRouter.openapi(getMonitorPortGroupRoute, getMonitorPortGroupHandler);
export default getRouter;
