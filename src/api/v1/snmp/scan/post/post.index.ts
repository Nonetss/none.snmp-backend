import { OpenAPIHono } from '@hono/zod-openapi';
import { postScanRoute } from './post.route';
import { postScanHandler } from './post.handler';

const router = new OpenAPIHono();

router.openapi(postScanRoute, postScanHandler);

export default router;
