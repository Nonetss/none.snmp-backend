import { OpenAPIHono } from '@hono/zod-openapi';
import { postPortScanRoute } from './scan.route';
import { postPortScanHandler } from './scan.handler';

const router = new OpenAPIHono();
router.openapi(postPortScanRoute, postPortScanHandler);
export default router;
