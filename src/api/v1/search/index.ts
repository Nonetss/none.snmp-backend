import { OpenAPIHono } from '@hono/zod-openapi';
import connectionRouter from '@/api/v1/search/connection/get.index';
import deviceSearchRouter from '@/api/v1/search/device/get.index';
import resourceSearchRouter from '@/api/v1/search/resource/get.index';
import serviceSearchRouter from '@/api/v1/search/service/get.index';

const searchRouter = new OpenAPIHono();

searchRouter.route('/', connectionRouter);
searchRouter.route('/', deviceSearchRouter);
searchRouter.route('/', resourceSearchRouter);
searchRouter.route('/', serviceSearchRouter);

export default searchRouter;
