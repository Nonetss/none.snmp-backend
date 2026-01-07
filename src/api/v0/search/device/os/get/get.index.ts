import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceByOsRoute } from './get.route';
import { getDeviceByOsHandler } from './get.handler';

const router = new OpenAPIHono();

router.openapi(getDeviceByOsRoute, getDeviceByOsHandler);

export default router;
