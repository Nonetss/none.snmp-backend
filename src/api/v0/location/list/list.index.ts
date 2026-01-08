import { OpenAPIHono } from '@hono/zod-openapi';
import { listLocationRoute } from './list.route';
import { listLocationHandler } from './list.handler';

const router = new OpenAPIHono();

router.openapi(listLocationRoute, listLocationHandler);

export default router;
