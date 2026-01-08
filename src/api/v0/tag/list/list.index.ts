import { OpenAPIHono } from '@hono/zod-openapi';
import { listTagRoute } from './list.route';
import { listTagHandler } from './list.handler';

const router = new OpenAPIHono();
router.openapi(listTagRoute, listTagHandler);
export default router;
