import { OpenAPIHono } from '@hono/zod-openapi';
import { getTagRoute } from './get.route';
import { getTagHandler } from './get.handler';

const router = new OpenAPIHono();
router.openapi(getTagRoute, getTagHandler);
export default router;
