import { OpenAPIHono } from '@hono/zod-openapi';
import { listDeviceRoute } from './list.route';
import { listDeviceHandler } from './list.handler';

const router = new OpenAPIHono();
router.openapi(listDeviceRoute, listDeviceHandler);
export default router;
