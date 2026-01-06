import { OpenAPIHono } from '@hono/zod-openapi';
import { listTaskScheduleRoute } from './list.route';
import { listTaskScheduleHandler } from './list.handler';
const router = new OpenAPIHono();
router.openapi(listTaskScheduleRoute, listTaskScheduleHandler);
export default router;
