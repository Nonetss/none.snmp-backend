import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteAuthRoute } from '@/api/v0/snmp/auth/delete/delete.route';
import { deleteAuthHandler } from '@/api/v0/snmp/auth/delete/delete.handler';

const router = new OpenAPIHono();

router.openapi(deleteAuthRoute, deleteAuthHandler);

export default router;
