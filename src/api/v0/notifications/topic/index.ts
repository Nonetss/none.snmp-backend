import { OpenAPIHono } from '@hono/zod-openapi';
import { postNtfyTopicRoute } from './post/post.route';
import { postNtfyTopicHandler } from './post/post.handler';
import { listNtfyTopicRoute } from './list/list.route';
import { listNtfyTopicHandler } from './list/list.handler';
import { getNtfyTopicRoute } from './get/get.route';
import { getNtfyTopicHandler } from './get/get.handler';
import { patchNtfyTopicRoute } from './patch/patch.route';
import { patchNtfyTopicHandler } from './patch/patch.handler';
import { deleteNtfyTopicRoute } from './delete/delete.route';
import { deleteNtfyTopicHandler } from './delete/delete.handler';

const topicRouter = new OpenAPIHono();

topicRouter.openapi(postNtfyTopicRoute, postNtfyTopicHandler);
topicRouter.openapi(listNtfyTopicRoute, listNtfyTopicHandler);
topicRouter.openapi(getNtfyTopicRoute, getNtfyTopicHandler);
topicRouter.openapi(patchNtfyTopicRoute, patchNtfyTopicHandler);
topicRouter.openapi(deleteNtfyTopicRoute, deleteNtfyTopicHandler);

export default topicRouter;
