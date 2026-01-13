import { OpenAPIHono } from '@hono/zod-openapi';
import { patchNpmAuthRoute } from './patch.route';
import { patchNpmAuthHandler } from './patch.handler';

const patchNpmAuthRouter = new OpenAPIHono();

patchNpmAuthRouter.openapi(patchNpmAuthRoute, patchNpmAuthHandler);

export default patchNpmAuthRouter;
