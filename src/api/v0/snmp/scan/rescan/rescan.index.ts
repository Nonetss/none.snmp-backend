import { OpenAPIHono } from '@hono/zod-openapi';
import { postRescanRoute } from './rescan.route';
import { postRescanHandler } from './rescan.handler';

const router = new OpenAPIHono();

router.openapi(postRescanRoute, postRescanHandler);

export default router;
