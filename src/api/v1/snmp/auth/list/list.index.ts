import { OpenAPIHono } from '@hono/zod-openapi';
import { listAuthRoute } from './list.route';
import { listAuthHandler } from './list.handler';

const router = new OpenAPIHono();

router.openapi(listAuthRoute, listAuthHandler);

export default router;
