import { OpenAPIHono } from '@hono/zod-openapi';
import { getSubnetRoute } from './get.route';
import { getSubnetHandler } from './get.handler';

const router = new OpenAPIHono();
router.openapi(getSubnetRoute, getSubnetHandler);
export default router;
