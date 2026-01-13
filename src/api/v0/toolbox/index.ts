import { OpenAPIHono } from '@hono/zod-openapi';
import tracerouteRouter from './traceroute';
import pingRouter from './ping';
import dnsRouter from './dns';
import domainRouter from './domain';
import dnsServerRouter from './dnsServer';

const toolboxRouter = new OpenAPIHono();

toolboxRouter.route('/traceroute', tracerouteRouter);
toolboxRouter.route('/ping', pingRouter);
toolboxRouter.route('/dns', dnsRouter);
toolboxRouter.route('/domain', domainRouter);
toolboxRouter.route('/dns-server', dnsServerRouter);

export default toolboxRouter;
