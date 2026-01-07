import { OpenAPIHono } from '@hono/zod-openapi';
import { identifyDeviceRoute } from './identify.route';
import { identifyDeviceHandler } from './identify.handler';

const router = new OpenAPIHono();
router.openapi(identifyDeviceRoute, identifyDeviceHandler);
export default router;
