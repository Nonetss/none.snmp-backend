import { OpenAPIHono } from '@hono/zod-openapi';
import { postSeedRoute } from './post.route';
import { postSeedHandler } from './post.handler';

const router = new OpenAPIHono();

router.openapi(postSeedRoute, postSeedHandler);

export default router;
