import { OpenAPIHono } from '@hono/zod-openapi';
import { postSubnetRoute } from './post.route';
import { postSubnetHandler } from './post.handler';

const router = new OpenAPIHono();
router.openapi(postSubnetRoute, postSubnetHandler);
export default router;
