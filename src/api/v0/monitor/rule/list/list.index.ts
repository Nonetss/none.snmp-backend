import { OpenAPIHono } from '@hono/zod-openapi';
import { listMonitorRulesRoute } from './list.route';
import { listMonitorRulesHandler } from './list.handler';

const router = new OpenAPIHono();
router.openapi(listMonitorRulesRoute, listMonitorRulesHandler);
export default router;
