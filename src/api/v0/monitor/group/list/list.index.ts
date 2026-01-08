import { OpenAPIHono } from '@hono/zod-openapi';
import { listMonitorGroupsRoute } from './list.route';
import { listMonitorGroupsHandler } from './list.handler';

const router = new OpenAPIHono();
router.openapi(listMonitorGroupsRoute, listMonitorGroupsHandler);
export default router;
