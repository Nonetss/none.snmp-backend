import { OpenAPIHono } from '@hono/zod-openapi';
import pangolinRouter from './get/get.index';
import pangolinAuthRouter from './auth';
import pangolinOrgRouter from './org';

const pangolinProxyRouter = new OpenAPIHono();

pangolinProxyRouter.route('/', pangolinRouter);
pangolinProxyRouter.route('/auth', pangolinAuthRouter);
pangolinProxyRouter.route('/org', pangolinOrgRouter);

export default pangolinProxyRouter;
