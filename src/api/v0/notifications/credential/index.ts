import { OpenAPIHono } from '@hono/zod-openapi';
import { postNtfyCredentialRoute } from '@/api/v0/notifications/credential/post/post.route';
import { postNtfyCredentialHandler } from '@/api/v0/notifications/credential/post/post.handler';
import { listNtfyCredentialRoute } from '@/api/v0/notifications/credential/list/list.route';
import { listNtfyCredentialHandler } from '@/api/v0/notifications/credential/list/list.handler';
import { getNtfyCredentialRoute } from '@/api/v0/notifications/credential/get/get.route';
import { getNtfyCredentialHandler } from '@/api/v0/notifications/credential/get/get.handler';
import { patchNtfyCredentialRoute } from '@/api/v0/notifications/credential/patch/patch.route';
import { patchNtfyCredentialHandler } from '@/api/v0/notifications/credential/patch/patch.handler';
import { deleteNtfyCredentialRoute } from '@/api/v0/notifications/credential/delete/delete.route';
import { deleteNtfyCredentialHandler } from '@/api/v0/notifications/credential/delete/delete.handler';

const credentialRouter = new OpenAPIHono();

credentialRouter.openapi(postNtfyCredentialRoute, postNtfyCredentialHandler);
credentialRouter.openapi(listNtfyCredentialRoute, listNtfyCredentialHandler);
credentialRouter.openapi(getNtfyCredentialRoute, getNtfyCredentialHandler);
credentialRouter.openapi(patchNtfyCredentialRoute, patchNtfyCredentialHandler);
credentialRouter.openapi(
  deleteNtfyCredentialRoute,
  deleteNtfyCredentialHandler,
);

export default credentialRouter;
