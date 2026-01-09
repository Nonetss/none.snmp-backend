import { OpenAPIHono } from '@hono/zod-openapi';
import { postSubnetPortScanRoute } from './scan.route';
import { postSubnetPortScanHandler } from './scan.handler';

const router = new OpenAPIHono();
router.openapi(postSubnetPortScanRoute, postSubnetPortScanHandler);
export default router;
