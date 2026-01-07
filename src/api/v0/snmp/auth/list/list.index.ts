import { OpenAPIHono } from '@hono/zod-openapi';
import { listAuthRoute } from '@/api/v0/snmp/auth/list/list.route';
import { listAuthHandler } from '@/api/v0/snmp/auth/list/list.handler';

const router = new OpenAPIHono();

router.openapi(listAuthRoute, listAuthHandler);

export default router;
