import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteMonitorGroupRoute } from './delete.route';
import { deleteMonitorGroupHandler } from './delete.handler';

const router = new OpenAPIHono();
router.openapi(deleteMonitorGroupRoute, deleteMonitorGroupHandler);
export default router;
