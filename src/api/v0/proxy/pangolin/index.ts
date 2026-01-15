import { OpenAPIHono } from '@hono/zod-openapi';
import pangolinRouter from './get/get.index';
import pangolinAuthRouter from './auth';

const pangolinProxyRouter = new OpenAPIHono();

pangolinProxyRouter.route('/', pangolinRouter);
pangolinProxyRouter.route('/auth', pangolinAuthRouter);

export default pangolinProxyRouter;
