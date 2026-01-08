import { OpenAPIHono } from '@hono/zod-openapi';
import { getMonitorGroupRoute } from './get.route';
import { getMonitorGroupHandler } from './get.handler';

const router = new OpenAPIHono();
router.openapi(getMonitorGroupRoute, getMonitorGroupHandler);
export default router;
