import { OpenAPIHono } from '@hono/zod-openapi';
import { patchTagRoute } from './patch.route';
import { patchTagHandler } from './patch.handler';

const router = new OpenAPIHono();
router.openapi(patchTagRoute, patchTagHandler);
export default router;
