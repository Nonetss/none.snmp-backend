import { OpenAPIHono } from '@hono/zod-openapi';
import { postSeedRoute } from '@/api/v0/snmp/metrics/seed/post.route';
import { postSeedHandler } from '@/api/v0/snmp/metrics/seed/post.handler';

const router = new OpenAPIHono();

router.openapi(postSeedRoute, postSeedHandler);

export default router;
