import { OpenAPIHono } from '@hono/zod-openapi';
import { patchLocationRoute } from './patch.route';
import { patchLocationHandler } from './patch.handler';

const router = new OpenAPIHono();

router.openapi(patchLocationRoute, patchLocationHandler);

export default router;
