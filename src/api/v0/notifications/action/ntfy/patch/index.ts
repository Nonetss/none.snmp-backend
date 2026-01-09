import { OpenAPIHono } from '@hono/zod-openapi';
import { patchNtfyActionRoute } from './patch.route';
import { patchNtfyActionHandler } from './patch.handler';

const router = new OpenAPIHono();

router.openapi(patchNtfyActionRoute, patchNtfyActionHandler);

export default router;
