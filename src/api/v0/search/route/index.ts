import { OpenAPIHono } from '@hono/zod-openapi';
import routeGetRouter from './get/get.index';
const routeRouter = new OpenAPIHono();
routeRouter.route('/', routeGetRouter);
export default routeRouter;
