import { OpenAPIHono } from '@hono/zod-openapi';
import { postAuthRoute } from './post.route';
import { postAuthHandler } from './post.handler';

const router = new OpenAPIHono();

router.openapi(postAuthRoute, postAuthHandler);

export default router;
