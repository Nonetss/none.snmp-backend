import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteLocationRoute } from './delete.route';
import { deleteLocationHandler } from './delete.handler';

const router = new OpenAPIHono();

router.openapi(deleteLocationRoute, deleteLocationHandler);

export default router;
