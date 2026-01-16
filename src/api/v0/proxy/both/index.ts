import { OpenAPIHono } from '@hono/zod-openapi';
import bothGetRouter from './get/get.index';

const bothProxyRouter = new OpenAPIHono();

bothProxyRouter.route('/', bothGetRouter);

export default bothProxyRouter;
