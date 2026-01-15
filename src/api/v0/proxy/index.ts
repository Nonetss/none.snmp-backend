import { OpenAPIHono } from '@hono/zod-openapi';
import npmRouter from './npm/get.index';
import npmAuthRouter from './npm/auth';
import pangolinProxyRouter from './pangolin';

const proxyRouter = new OpenAPIHono();

proxyRouter.route('/', npmRouter);
proxyRouter.route('/npm', npmAuthRouter);
proxyRouter.route('/pangolin', pangolinProxyRouter);

export default proxyRouter;
