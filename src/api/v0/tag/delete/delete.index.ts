import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteTagRoute } from './delete.route';
import { deleteTagHandler } from './delete.handler';

const router = new OpenAPIHono();
router.openapi(deleteTagRoute, deleteTagHandler);
export default router;
