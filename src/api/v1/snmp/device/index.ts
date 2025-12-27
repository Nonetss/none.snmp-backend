import { OpenAPIHono } from '@hono/zod-openapi';
import listRouter from './list/list.index';
import deleteRouter from './delete/delete.index';

const deviceRouter = new OpenAPIHono();

deviceRouter.route('/', listRouter);
deviceRouter.route('/', deleteRouter);

export default deviceRouter;
