import { OpenAPIHono } from '@hono/zod-openapi';
import { postNtfyActionRoute } from './post.route';
import { postNtfyActionHandler } from './post.handler';

const router = new OpenAPIHono();

router.openapi(postNtfyActionRoute, postNtfyActionHandler);

export default router;
