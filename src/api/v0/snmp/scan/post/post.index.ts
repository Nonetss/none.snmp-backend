import { OpenAPIHono } from '@hono/zod-openapi';
import { postScanRoute } from '@/api/v0/snmp/scan/post/post.route';
import { postScanHandler } from '@/api/v0/snmp/scan/post/post.handler';

const router = new OpenAPIHono();

router.openapi(postScanRoute, postScanHandler);

export default router;
