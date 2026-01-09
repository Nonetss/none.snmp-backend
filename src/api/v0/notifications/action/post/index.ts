import { OpenAPIHono } from '@hono/zod-openapi';
import { postNotificationActionRoute } from './post.route';
import { postNotificationActionHandler } from './post.handler';

const router = new OpenAPIHono();

router.openapi(postNotificationActionRoute, postNotificationActionHandler);

export default router;
