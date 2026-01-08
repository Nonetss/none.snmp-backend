import { OpenAPIHono } from '@hono/zod-openapi';
import tcpRouter from './tcp';
import groupRouter from './group';

const monitorRouter = new OpenAPIHono();

monitorRouter.route('/tcp', tcpRouter);
monitorRouter.route('/group', groupRouter);

export default monitorRouter;
