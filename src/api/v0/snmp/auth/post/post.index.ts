import { OpenAPIHono } from '@hono/zod-openapi';
import { postAuthRoute } from '@/api/v0/snmp/auth/post/post.route';
import { postAuthHandler } from '@/api/v0/snmp/auth/post/post.handler';

const router = new OpenAPIHono();

router.openapi(postAuthRoute, postAuthHandler);

export default router;
