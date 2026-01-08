import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteMonitorPortGroupRoute } from './delete.route';
import { deleteMonitorPortGroupHandler } from './delete.handler';

const deleteRouter = new OpenAPIHono();
deleteRouter.openapi(
  deleteMonitorPortGroupRoute,
  deleteMonitorPortGroupHandler,
);
export default deleteRouter;
