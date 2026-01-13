import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteKomodoAuthRoute } from './delete.route';
import { deleteKomodoAuthHandler } from './delete.handler';

const deleteKomodoAuthRouter = new OpenAPIHono();

deleteKomodoAuthRouter.openapi(deleteKomodoAuthRoute, deleteKomodoAuthHandler);

export default deleteKomodoAuthRouter;
