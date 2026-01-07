import { OpenAPIHono } from '@hono/zod-openapi';
import connectionRouter from '@/api/v0/search/connection/index';
import deviceRouter from '@/api/v0/search/device/index';

import resourceRouter from '@/api/v0/search/resource/index';
import serviceRouter from '@/api/v0/search/service/index';
import systemRouter from '@/api/v0/search/system/index';
import interfaceRouter from '@/api/v0/search/interface/index';
import ipRouter from '@/api/v0/search/ip/index';
import routeRouter from '@/api/v0/search/route/index';
import cdpRouter from '@/api/v0/search/cdp/index';
import lldpRouter from '@/api/v0/search/lldp/index';
import entityRouter from '@/api/v0/search/entity/index';
import bridgeRouter from '@/api/v0/search/bridge/index';
import statsRouter from '@/api/v0/search/stats/index';

const searchRouter = new OpenAPIHono();

searchRouter.route('/stats', statsRouter);

searchRouter.route('/system', systemRouter);
searchRouter.route('/interface', interfaceRouter);
searchRouter.route('/ip', ipRouter);
searchRouter.route('/route', routeRouter);
searchRouter.route('/cdp', cdpRouter);
searchRouter.route('/lldp', lldpRouter);
searchRouter.route('/entity', entityRouter);
searchRouter.route('/bridge', bridgeRouter);
searchRouter.route('/resource', resourceRouter);
searchRouter.route('/service', serviceRouter);
searchRouter.route('/', connectionRouter);
searchRouter.route('/device', deviceRouter);

export default searchRouter;
