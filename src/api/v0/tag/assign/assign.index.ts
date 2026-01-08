import { OpenAPIHono } from '@hono/zod-openapi';
import { postAssignTagsRoute, postUnassignTagsRoute } from './assign.route';
import {
  postAssignTagsHandler,
  postUnassignTagsHandler,
} from './assign.handler';

const router = new OpenAPIHono();

router.openapi(postAssignTagsRoute, postAssignTagsHandler);
router.openapi(postUnassignTagsRoute, postUnassignTagsHandler);

export default router;
