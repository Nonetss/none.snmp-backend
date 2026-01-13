import { OpenAPIHono } from '@hono/zod-openapi';
import npmRouter from './npm/get.index';
import pangolinRouter from './pangolin/get.index';

const proxyRouter = new OpenAPIHono();

proxyRouter.route('/', npmRouter);
proxyRouter.route('/', pangolinRouter);

export default proxyRouter;
