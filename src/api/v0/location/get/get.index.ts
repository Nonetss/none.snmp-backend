import { OpenAPIHono } from '@hono/zod-openapi';
import { getLocationRoute } from './get.route';
import { getLocationHandler } from './get.handler';

const router = new OpenAPIHono();

router.openapi(getLocationRoute, getLocationHandler);

export default router;
