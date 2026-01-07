import { OpenAPIHono } from '@hono/zod-openapi';
import {
  postPollHikvisionRoute,
  postPollSingleHikvisionRoute,
} from './post.route';
import {
  postPollHikvisionHandler,
  postPollSingleHikvisionHandler,
} from './post.handler';

const router = new OpenAPIHono();

router.openapi(postPollHikvisionRoute, postPollHikvisionHandler);
router.openapi(postPollSingleHikvisionRoute, postPollSingleHikvisionHandler);

export default router;
