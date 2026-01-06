import { OpenAPIHono } from '@hono/zod-openapi';
import { getApplicationInventoryRoute } from './inventory.route';
import { getApplicationInventoryHandler } from './inventory.handler';

const router = new OpenAPIHono();

router.openapi(getApplicationInventoryRoute, getApplicationInventoryHandler);

export default router;
