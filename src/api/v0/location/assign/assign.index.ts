import { OpenAPIHono } from '@hono/zod-openapi';
import { assignLocationRoute } from './assign.route';
import { assignLocationHandler } from './assign.handler';

const router = new OpenAPIHono();

router.openapi(assignLocationRoute, assignLocationHandler);

export default router;
