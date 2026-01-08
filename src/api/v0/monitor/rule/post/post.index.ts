import { OpenAPIHono } from '@hono/zod-openapi';
import { postMonitorRuleRoute } from './post.route';
import { postMonitorRuleHandler } from './post.handler';

const router = new OpenAPIHono();
router.openapi(postMonitorRuleRoute, postMonitorRuleHandler);
export default router;
