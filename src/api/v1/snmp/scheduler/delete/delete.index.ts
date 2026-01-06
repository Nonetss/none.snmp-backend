import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteTaskScheduleRoute } from './delete.route';
import { deleteTaskScheduleHandler } from './delete.handler';
const router = new OpenAPIHono();
router.openapi(deleteTaskScheduleRoute, deleteTaskScheduleHandler);
export default router;
