import { OpenAPIHono } from '@hono/zod-openapi';
import { postScanAllRoute } from './all.route';
import { postScanAllHandler } from './all.handler';

const allRouter = new OpenAPIHono();

allRouter.openapi(postScanAllRoute, postScanAllHandler);

export default allRouter;
