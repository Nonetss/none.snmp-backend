import { OpenAPIHono } from '@hono/zod-openapi';
import lldpGetRouter from './get/get.index';
const lldpRouter = new OpenAPIHono();
lldpRouter.route('/', lldpGetRouter);
export default lldpRouter;
