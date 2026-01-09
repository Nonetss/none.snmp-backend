import { OpenAPIHono } from '@hono/zod-openapi';
import { patchNotificationActionRoute } from './patch.route';
import { patchNotificationActionHandler } from './patch.handler';

const router = new OpenAPIHono();

router.openapi(patchNotificationActionRoute, patchNotificationActionHandler);

export default router;
