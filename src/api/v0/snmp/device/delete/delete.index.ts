import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteDeviceRoute } from '@/api/v0/snmp/device/delete/delete.route';
import { deleteDeviceHandler } from '@/api/v0/snmp/device/delete/delete.handler';

const router = new OpenAPIHono();
router.openapi(deleteDeviceRoute, deleteDeviceHandler);
export default router;
