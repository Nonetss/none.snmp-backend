import { OpenAPIHono } from '@hono/zod-openapi';
import { patchTaskScheduleRoute } from './patch.route';
import { patchTaskScheduleHandler } from './patch.handler';

const router = new OpenAPIHono();

router.openapi(patchTaskScheduleRoute, patchTaskScheduleHandler);

export default router;
