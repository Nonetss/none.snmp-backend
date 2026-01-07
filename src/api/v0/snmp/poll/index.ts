import { OpenAPIHono } from '@hono/zod-openapi';
import lldpPollRouter from './lldp/post.index';
import entityPollRouter from './entity/post.index';
import systemPollRouter from './system/post.index';
import routePollRouter from './route/post.index';
import cdpPollRouter from './cdp/post.index';
import interfacePollRouter from './interface/post.index';
import ipPollRouter from './ip/post.index';
import resourcePollRouter from './resource/post.index';
import bridgePollRouter from './bridge/post.index';
import hikvisionPollRouter from './hikvision/post.index';
import allPollRouter from './all/post.index';

const pollRouter = new OpenAPIHono();

pollRouter.route('/lldp', lldpPollRouter);
pollRouter.route('/entity', entityPollRouter);
pollRouter.route('/system', systemPollRouter);
pollRouter.route('/route', routePollRouter);
pollRouter.route('/cdp', cdpPollRouter);
pollRouter.route('/interface', interfacePollRouter);
pollRouter.route('/ip', ipPollRouter);
pollRouter.route('/resource', resourcePollRouter);
pollRouter.route('/bridge', bridgePollRouter);
pollRouter.route('/hikvision', hikvisionPollRouter);
pollRouter.route('/all', allPollRouter);

export default pollRouter;
