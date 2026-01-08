import { OpenAPIHono } from '@hono/zod-openapi';
import { getTcpCheckRoute } from './tcp/get/get.route';
import { getTcpCheckHandler } from './tcp/get/get.handler';
import { postPortScanRoute } from './tcp/post/scan.route';
import { postPortScanHandler } from './tcp/post/scan.handler';

const monitorRouter = new OpenAPIHono();

monitorRouter.openapi(getTcpCheckRoute, getTcpCheckHandler);
monitorRouter.openapi(postPortScanRoute, postPortScanHandler);

export default monitorRouter;
