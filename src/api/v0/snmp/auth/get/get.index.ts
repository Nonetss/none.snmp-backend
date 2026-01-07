import { OpenAPIHono } from '@hono/zod-openapi';
import { getAuthRoute } from '@/api/v0/snmp/auth/get/get.route';
import { getAuthHandler } from '@/api/v0/snmp/auth/get/get.handler';

const router = new OpenAPIHono();

router.openapi(getAuthRoute, getAuthHandler);

export default router;
