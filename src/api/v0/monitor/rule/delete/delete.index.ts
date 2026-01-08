import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteMonitorRuleRoute } from './delete.route';
import { deleteMonitorRuleHandler } from './delete.handler';

const router = new OpenAPIHono();
router.openapi(deleteMonitorRuleRoute, deleteMonitorRuleHandler);
export default router;
