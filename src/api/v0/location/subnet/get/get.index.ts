import { OpenAPIHono } from '@hono/zod-openapi';
import { getSubnetsWithLocationStatusRoute } from './get.route';
import { getSubnetsWithLocationStatusHandler } from './get.handler';

const router = new OpenAPIHono();

router.openapi(
  getSubnetsWithLocationStatusRoute,
  getSubnetsWithLocationStatusHandler,
);

export default router;
