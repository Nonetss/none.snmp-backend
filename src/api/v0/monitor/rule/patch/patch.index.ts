import { OpenAPIHono } from '@hono/zod-openapi';
import { patchMonitorRuleRoute } from './patch.route';
import { patchMonitorRuleHandler } from './patch.handler';

const router = new OpenAPIHono();
router.openapi(patchMonitorRuleRoute, patchMonitorRuleHandler);
export default router;
