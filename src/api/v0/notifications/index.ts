import { OpenAPIHono } from '@hono/zod-openapi';
import credentialRouter from './credential';

const notificationsRouter = new OpenAPIHono();

notificationsRouter.route('/credential', credentialRouter);

export default notificationsRouter;
