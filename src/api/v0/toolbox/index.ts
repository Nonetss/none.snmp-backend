import { OpenAPIHono } from '@hono/zod-openapi';
import tracerouteRouter from './traceroute/get.index';
import pingRouter from './ping/get.index';
import dnsRouter from './dns/get.index';
import tcpRouter from './tcp/index';
import domainRouter from './domain/index';
import dnsServerRouter from './dnsServer/index';

const toolboxRouter = new OpenAPIHono();

toolboxRouter.route('/traceroute', tracerouteRouter);
toolboxRouter.route('/ping', pingRouter);
toolboxRouter.route('/dns', dnsRouter);
toolboxRouter.route('/tcp', tcpRouter);
toolboxRouter.route('/domain', domainRouter);
toolboxRouter.route('/dnsServer', dnsServerRouter);

export default toolboxRouter;
