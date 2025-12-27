import { OpenAPIHono } from '@hono/zod-openapi';
import { patchAuthRoute } from './patch.route';
import { patchAuthHandler } from './patch.handler';

const router = new OpenAPIHono();

router.openapi(patchAuthRoute, patchAuthHandler);

export default router;
