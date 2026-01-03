import { OpenAPIHono } from '@hono/zod-openapi';
import connectionRouter from '@/api/v1/search/connection/index';
import deviceRouter from '@/api/v1/search/device/index';
import resourceSearchRouter from '@/api/v1/search/resource/get.index';
import serviceSearchRouter from '@/api/v1/search/service/get.index';
import statsRouter from '@/api/v1/search/stats/index';

const searchRouter = new OpenAPIHono();

searchRouter.route('/stats', statsRouter);
searchRouter.route('/', connectionRouter);
searchRouter.route('/device', deviceRouter);
searchRouter.route('/', resourceSearchRouter);
searchRouter.route('/', serviceSearchRouter);

export default searchRouter;
