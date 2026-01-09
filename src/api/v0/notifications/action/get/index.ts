import { OpenAPIHono } from '@hono/zod-openapi';
import { getNotificationActionRoute } from './get.route';
import { getNotificationActionHandler } from './get.handler';

const router = new OpenAPIHono();

router.openapi(getNotificationActionRoute, getNotificationActionHandler);

export default router;
