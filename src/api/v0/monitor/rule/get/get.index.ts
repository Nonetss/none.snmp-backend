import { OpenAPIHono } from '@hono/zod-openapi';
import { getMonitorRuleRoute } from './get.route';
import { getMonitorRuleHandler } from './get.handler';

const router = new OpenAPIHono();
router.openapi(getMonitorRuleRoute, getMonitorRuleHandler);
export default router;
