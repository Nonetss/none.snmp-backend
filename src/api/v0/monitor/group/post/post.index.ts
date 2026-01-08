import { OpenAPIHono } from '@hono/zod-openapi';
import { postMonitorGroupRoute } from './post.route';
import { postMonitorGroupHandler } from './post.handler';

const router = new OpenAPIHono();
router.openapi(postMonitorGroupRoute, postMonitorGroupHandler);
export default router;
