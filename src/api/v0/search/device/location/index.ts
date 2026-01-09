import { OpenAPIHono } from '@hono/zod-openapi';
import { patchDeviceLocationRoute } from './location.route';
import { patchDeviceLocationHandler } from './location.handler';

const router = new OpenAPIHono();
router.openapi(patchDeviceLocationRoute, patchDeviceLocationHandler);
export default router;
