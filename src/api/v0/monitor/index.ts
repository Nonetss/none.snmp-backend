import { OpenAPIHono } from '@hono/zod-openapi';
import { getTcpCheckRoute } from './get/get.route';
import { getTcpCheckHandler } from './get/get.handler';
import { postPortScanRoute } from './post/scan.route';
import { postPortScanHandler } from './post/scan.handler';

const monitorRouter = new OpenAPIHono();

monitorRouter.openapi(getTcpCheckRoute, getTcpCheckHandler);
monitorRouter.openapi(postPortScanRoute, postPortScanHandler);

export default monitorRouter;
