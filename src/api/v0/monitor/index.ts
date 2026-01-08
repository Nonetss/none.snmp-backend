import { OpenAPIHono } from '@hono/zod-openapi';
import tcpRouter from './tcp';
import groupRouter from './group';
import portGroupRouter from './port-group';

const monitorRouter = new OpenAPIHono();

monitorRouter.route('/tcp', tcpRouter);
monitorRouter.route('/group', groupRouter);
monitorRouter.route('/port-group', portGroupRouter);

export default monitorRouter;
