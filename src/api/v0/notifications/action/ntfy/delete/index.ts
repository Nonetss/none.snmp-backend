import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteNtfyActionRoute } from './delete.route';
import { deleteNtfyActionHandler } from './delete.handler';

const router = new OpenAPIHono();

router.openapi(deleteNtfyActionRoute, deleteNtfyActionHandler);

export default router;
