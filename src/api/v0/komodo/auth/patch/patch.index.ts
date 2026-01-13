import { OpenAPIHono } from '@hono/zod-openapi';
import { patchKomodoAuthRoute } from './patch.route';
import { patchKomodoAuthHandler } from './patch.handler';

const patchKomodoAuthRouter = new OpenAPIHono();

patchKomodoAuthRouter.openapi(patchKomodoAuthRoute, patchKomodoAuthHandler);

export default patchKomodoAuthRouter;
