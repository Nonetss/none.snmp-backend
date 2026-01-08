import { OpenAPIHono } from '@hono/zod-openapi';
import { postDevicePollAllRoute } from './poll.route';
import { postDevicePollAllHandler } from './poll.handler';

const router = new OpenAPIHono();

router.openapi(postDevicePollAllRoute, postDevicePollAllHandler);

export default router;
