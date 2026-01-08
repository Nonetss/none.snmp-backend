import { OpenAPIHono } from '@hono/zod-openapi';
import { postNtfyTopicRoute } from '@/api/v0/notifications/topic/post/post.route';
import { postNtfyTopicHandler } from '@/api/v0/notifications/topic/post/post.handler';
import { listNtfyTopicRoute } from '@/api/v0/notifications/topic/list/list.route';
import { listNtfyTopicHandler } from '@/api/v0/notifications/topic/list/list.handler';
import { getNtfyTopicRoute } from '@/api/v0/notifications/topic/get/get.route';
import { getNtfyTopicHandler } from '@/api/v0/notifications/topic/get/get.handler';
import { patchNtfyTopicRoute } from '@/api/v0/notifications/topic/patch/patch.route';
import { patchNtfyTopicHandler } from '@/api/v0/notifications/topic/patch/patch.handler';
import { deleteNtfyTopicRoute } from '@/api/v0/notifications/topic/delete/delete.route';
import { deleteNtfyTopicHandler } from '@/api/v0/notifications/topic/delete/delete.handler';

const topicRouter = new OpenAPIHono();

topicRouter.openapi(postNtfyTopicRoute, postNtfyTopicHandler);
topicRouter.openapi(listNtfyTopicRoute, listNtfyTopicHandler);
topicRouter.openapi(getNtfyTopicRoute, getNtfyTopicHandler);
topicRouter.openapi(patchNtfyTopicRoute, patchNtfyTopicHandler);
topicRouter.openapi(deleteNtfyTopicRoute, deleteNtfyTopicHandler);

export default topicRouter;
