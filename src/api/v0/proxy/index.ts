import { OpenAPIHono } from '@hono/zod-openapi';
import npmRouter from './npm/get.index';
import npmAuthRouter from './npm/auth';
import pangolinRouter from './pangolin/get.index';
import pangolinAuthRouter from './pangolin/auth';

const proxyRouter = new OpenAPIHono();

proxyRouter.route('/', npmRouter);
proxyRouter.route('/npm', npmAuthRouter);
proxyRouter.route('/', pangolinRouter);
proxyRouter.route('/pangolin', pangolinAuthRouter);

export default proxyRouter;
