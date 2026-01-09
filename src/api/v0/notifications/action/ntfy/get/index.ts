import { OpenAPIHono } from '@hono/zod-openapi';
import { getNtfyActionRoute } from './get.route';
import { getNtfyActionHandler } from './get.handler';

const router = new OpenAPIHono();

router.openapi(getNtfyActionRoute, getNtfyActionHandler);

export default router;
