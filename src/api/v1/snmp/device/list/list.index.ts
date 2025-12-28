import { OpenAPIHono } from '@hono/zod-openapi';
import { listDeviceRoute } from '@/api/v1/snmp/device/list/list.route';
import { listDeviceHandler } from '@/api/v1/snmp/device/list/list.handler';

const router = new OpenAPIHono();
router.openapi(listDeviceRoute, listDeviceHandler);
export default router;
