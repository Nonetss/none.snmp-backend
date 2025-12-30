import { OpenAPIHono } from '@hono/zod-openapi';
import { postPollBridgeRoute, postPollSingleBridgeRoute } from './post.route';
import {
  postPollBridgeHandler,
  postPollSingleBridgeHandler,
} from './post.handler';

const router = new OpenAPIHono();

router.openapi(postPollBridgeRoute, postPollBridgeHandler);
router.openapi(postPollSingleBridgeRoute, postPollSingleBridgeHandler);

export default router;
