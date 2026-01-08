import { OpenAPIHono } from '@hono/zod-openapi';
import credentialRouter from './credential';
import topicRouter from './topic';

const notificationsRouter = new OpenAPIHono();

notificationsRouter.route('/credential', credentialRouter);
notificationsRouter.route('/topic', topicRouter);

export default notificationsRouter;
