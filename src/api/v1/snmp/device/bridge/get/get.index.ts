import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceBridgeRoute } from './get.route';
import { getDeviceBridgeHandler } from './get.handler';

const router = new OpenAPIHono();

router.openapi(getDeviceBridgeRoute, getDeviceBridgeHandler);

export default router;
