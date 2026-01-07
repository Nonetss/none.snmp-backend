import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteSubnetRoute } from './delete.route';
import { deleteSubnetHandler } from './delete.handler';

const router = new OpenAPIHono();
router.openapi(deleteSubnetRoute, deleteSubnetHandler);
export default router;
