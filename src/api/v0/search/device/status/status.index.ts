import { OpenAPIHono } from '@hono/zod-openapi';
import { listDeviceStatusRoute } from './status.route';
import { listDeviceStatusHandler } from './status.handler';
import { postPingAllRoute } from './post.route';
import { postPingAllHandler } from './post.handler';

const router = new OpenAPIHono();

router.openapi(listDeviceStatusRoute, listDeviceStatusHandler);
router.openapi(postPingAllRoute, postPingAllHandler);

export default router;
