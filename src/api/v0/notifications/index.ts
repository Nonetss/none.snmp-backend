import { OpenAPIHono } from '@hono/zod-openapi';
import credentialRouter from '@/api/v0/notifications/credential';
import topicRouter from '@/api/v0/notifications/topic';
import actionRouter from '@/api/v0/notifications/action';

const notificationsRouter = new OpenAPIHono();

notificationsRouter.route('/credential', credentialRouter);
notificationsRouter.route('/topic', topicRouter);
notificationsRouter.route('/action', actionRouter);

export default notificationsRouter;
