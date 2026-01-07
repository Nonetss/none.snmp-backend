import { OpenAPIHono } from '@hono/zod-openapi';
import { patchSubnetRoute } from './patch.route';
import { patchSubnetHandler } from './patch.handler';

const router = new OpenAPIHono();
router.openapi(patchSubnetRoute, patchSubnetHandler);
export default router;
