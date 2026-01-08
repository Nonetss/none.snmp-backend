import { OpenAPIHono } from '@hono/zod-openapi';
import tcpRouter from './tcp';

const monitorRouter = new OpenAPIHono();

monitorRouter.route('/tcp', tcpRouter);

export default monitorRouter;
