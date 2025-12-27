import { OpenAPIHono } from '@hono/zod-openapi';
import { getAuthRoute } from './get.route';
import { getAuthHandler } from './get.handler';

const router = new OpenAPIHono();

router.openapi(getAuthRoute, getAuthHandler);

export default router;
