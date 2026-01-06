import { OpenAPIHono } from '@hono/zod-openapi';
import bridgeGetRouter from './get/get.index';

const bridgeRouter = new OpenAPIHono();

bridgeRouter.route('/', bridgeGetRouter);

export default bridgeRouter;
