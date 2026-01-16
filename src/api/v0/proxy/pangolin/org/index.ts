import { OpenAPIHono } from '@hono/zod-openapi';
import getPangolinOrgRouter from '@/api/v0/proxy/pangolin/org/get/get.index';
import postPangolinOrgRouter from '@/api/v0/proxy/pangolin/org/post/post.index';
import patchPangolinOrgRouter from '@/api/v0/proxy/pangolin/org/patch/patch.index';
import deletePangolinOrgRouter from '@/api/v0/proxy/pangolin/org/delete/delete.index';

const orgRouter = new OpenAPIHono();

orgRouter.route('/', getPangolinOrgRouter);
orgRouter.route('/', postPangolinOrgRouter);
orgRouter.route('/', patchPangolinOrgRouter);
orgRouter.route('/', deletePangolinOrgRouter);

export default orgRouter;
