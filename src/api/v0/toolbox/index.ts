import { OpenAPIHono } from '@hono/zod-openapi';
import tracerouteRouter from './traceroute/get.index';
import pingRouter from './ping/get.index';
import dnsRouter from './dns/get.index';
import tcpRouter from './tcp';
import domainRouter from './domain';
import dnsServerRouter from './dnsServer';

const toolboxRouter = new OpenAPIHono();

toolboxRouter.route('/traceroute', tracerouteRouter);
toolboxRouter.route('/ping', pingRouter);
toolboxRouter.route('/dns', dnsRouter);
toolboxRouter.route('/tcp', tcpRouter);
toolboxRouter.route('/domain', domainRouter);
toolboxRouter.route('/dns-server', dnsServerRouter);

export default toolboxRouter;
