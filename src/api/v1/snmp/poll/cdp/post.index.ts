import { OpenAPIHono } from '@hono/zod-openapi';
import { postPollCdpRoute, postPollSingleCdpRoute } from './post.route';
import { postPollCdpHandler, postPollSingleCdpHandler } from './post.handler';

const router = new OpenAPIHono();

router.openapi(postPollCdpRoute, postPollCdpHandler);
router.openapi(postPollSingleCdpRoute, postPollSingleCdpHandler);

export default router;
