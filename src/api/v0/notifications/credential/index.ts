import { OpenAPIHono } from '@hono/zod-openapi';
import { postNtfyCredentialRoute } from './post/post.route';
import { postNtfyCredentialHandler } from './post/post.handler';
import { listNtfyCredentialRoute } from './list/list.route';
import { listNtfyCredentialHandler } from './list/list.handler';
import { getNtfyCredentialRoute } from './get/get.route';
import { getNtfyCredentialHandler } from './get/get.handler';
import { patchNtfyCredentialRoute } from './patch/patch.route';
import { patchNtfyCredentialHandler } from './patch/patch.handler';
import { deleteNtfyCredentialRoute } from './delete/delete.route';
import { deleteNtfyCredentialHandler } from './delete/delete.handler';

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
