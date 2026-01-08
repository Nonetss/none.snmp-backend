import { OpenAPIHono } from '@hono/zod-openapi';
import { patchMonitorPortGroupRoute } from './patch.route';
import { patchMonitorPortGroupHandler } from './patch.handler';

const patchRouter = new OpenAPIHono();
patchRouter.openapi(patchMonitorPortGroupRoute, patchMonitorPortGroupHandler);
export default patchRouter;
