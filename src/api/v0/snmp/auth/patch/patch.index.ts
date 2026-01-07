import { OpenAPIHono } from '@hono/zod-openapi';
import { patchAuthRoute } from '@/api/v0/snmp/auth/patch/patch.route';
import { patchAuthHandler } from '@/api/v0/snmp/auth/patch/patch.handler';

const router = new OpenAPIHono();

router.openapi(patchAuthRoute, patchAuthHandler);

export default router;
