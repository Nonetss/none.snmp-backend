import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteNpmAuthRoute } from './delete.route';
import { deleteNpmAuthHandler } from './delete.handler';

const deleteNpmAuthRouter = new OpenAPIHono();

deleteNpmAuthRouter.openapi(deleteNpmAuthRoute, deleteNpmAuthHandler);

export default deleteNpmAuthRouter;
