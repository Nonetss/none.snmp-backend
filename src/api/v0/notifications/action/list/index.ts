import { OpenAPIHono } from '@hono/zod-openapi';
import { listNotificationActionsRoute } from './list.route';
import { listNotificationActionsHandler } from './list.handler';

const router = new OpenAPIHono();

router.openapi(listNotificationActionsRoute, listNotificationActionsHandler);

export default router;
