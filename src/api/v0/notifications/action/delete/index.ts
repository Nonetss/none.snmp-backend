import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteNotificationActionRoute } from './delete.route';
import { deleteNotificationActionHandler } from './delete.handler';

const router = new OpenAPIHono();

router.openapi(deleteNotificationActionRoute, deleteNotificationActionHandler);

export default router;
