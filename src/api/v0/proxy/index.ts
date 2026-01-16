import { OpenAPIHono } from '@hono/zod-openapi';
import npmProxyRouter from './npm';
import pangolinProxyRouter from './pangolin';
import bothProxyRouter from './both';

const proxyRouter = new OpenAPIHono();

proxyRouter.route('/', npmProxyRouter);
proxyRouter.route('/pangolin', pangolinProxyRouter);
proxyRouter.route('/both', bothProxyRouter);

export default proxyRouter;
