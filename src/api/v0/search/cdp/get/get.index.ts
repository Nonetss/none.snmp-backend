import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceCdpRoute } from './get.route';
import { getDeviceCdpHandler } from './get.handler';

const router = new OpenAPIHono();

router.openapi(getDeviceCdpRoute, getDeviceCdpHandler);

export default router;
