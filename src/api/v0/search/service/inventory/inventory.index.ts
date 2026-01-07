import { OpenAPIHono } from '@hono/zod-openapi';
import { getServiceInventoryRoute } from './inventory.route';
import { getServiceInventoryHandler } from './inventory.handler';

const router = new OpenAPIHono();

router.openapi(getServiceInventoryRoute, getServiceInventoryHandler);

export default router;
