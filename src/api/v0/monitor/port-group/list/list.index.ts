import { OpenAPIHono } from '@hono/zod-openapi';
import { listMonitorPortGroupsRoute } from './list.route';
import { listMonitorPortGroupsHandler } from './list.handler';

const listRouter = new OpenAPIHono();
listRouter.openapi(listMonitorPortGroupsRoute, listMonitorPortGroupsHandler);
export default listRouter;
