import { OpenAPIHono } from '@hono/zod-openapi';
import seedRouter from './seed/post.index';

const metricsRouter = new OpenAPIHono();

metricsRouter.route('/seed', seedRouter);

export default metricsRouter;
