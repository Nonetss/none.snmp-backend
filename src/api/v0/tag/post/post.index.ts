import { OpenAPIHono } from '@hono/zod-openapi';
import { postTagRoute } from './post.route';
import { postTagHandler } from './post.handler';

const router = new OpenAPIHono();
router.openapi(postTagRoute, postTagHandler);
export default router;
