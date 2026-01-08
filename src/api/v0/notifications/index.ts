import { OpenAPIHono } from '@hono/zod-openapi';
import credentialRouter from './credential';
import topicRouter from './topic';
import actionRouter from './action';

const notificationsRouter = new OpenAPIHono();

notificationsRouter.route('/credential', credentialRouter);
notificationsRouter.route('/topic', topicRouter);
notificationsRouter.route('/action', actionRouter);

export default notificationsRouter;
