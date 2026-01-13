import { OpenAPIHono } from '@hono/zod-openapi';
import { getTcpCheckRoute } from './get.route';
import { getTcpCheckHandler } from './get.handler';

const router = new OpenAPIHono();
router.openapi(getTcpCheckRoute, getTcpCheckHandler);
export default router;
