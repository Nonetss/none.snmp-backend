import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteAuthRoute } from './delete.route';
import { deleteAuthHandler } from './delete.handler';

const router = new OpenAPIHono();

router.openapi(deleteAuthRoute, deleteAuthHandler);

export default router;
