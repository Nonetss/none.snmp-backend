import { OpenAPIHono } from '@hono/zod-openapi';
import getPangolinOrgRouter from './get/get.index';
import postPangolinOrgRouter from './post/post.index';
import patchPangolinOrgRouter from './patch/patch.index';
import deletePangolinOrgRouter from './delete/delete.index';

const orgRouter = new OpenAPIHono();

orgRouter.route('/org', getPangolinOrgRouter);
orgRouter.route('/org', postPangolinOrgRouter);
orgRouter.route('/org', patchPangolinOrgRouter);
orgRouter.route('/org', deletePangolinOrgRouter);

export default orgRouter;
