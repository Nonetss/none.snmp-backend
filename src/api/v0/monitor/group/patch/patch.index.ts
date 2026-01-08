import { OpenAPIHono } from '@hono/zod-openapi';
import { patchMonitorGroupRoute } from './patch.route';
import { patchMonitorGroupHandler } from './patch.handler';

const router = new OpenAPIHono();
router.openapi(patchMonitorGroupRoute, patchMonitorGroupHandler);
export default router;
