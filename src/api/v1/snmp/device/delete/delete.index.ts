import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteDeviceRoute } from './delete.route';
import { deleteDeviceHandler } from './delete.handler';

const router = new OpenAPIHono();
router.openapi(deleteDeviceRoute, deleteDeviceHandler);
export default router;
