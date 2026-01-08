import { OpenAPIHono } from '@hono/zod-openapi';
import { postLocationRoute } from './post.route';
import { postLocationHandler } from './post.handler';

const router = new OpenAPIHono();

router.openapi(postLocationRoute, postLocationHandler);

export default router;
