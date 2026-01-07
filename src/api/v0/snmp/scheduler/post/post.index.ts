import { OpenAPIHono } from '@hono/zod-openapi';
import { postTaskScheduleRoute } from './post.route';
import { postTaskScheduleHandler } from './post.handler';

const router = new OpenAPIHono();

router.openapi(postTaskScheduleRoute, postTaskScheduleHandler);

export default router;
