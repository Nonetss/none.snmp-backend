import { OpenAPIHono } from '@hono/zod-openapi';
import tcpRouter from './tcp';
import groupRouter from './group';
import portGroupRouter from './port-group';
import ruleRouter from './rule';
import statusRouter from './status';

const monitorRouter = new OpenAPIHono();

monitorRouter.route('/tcp', tcpRouter);
monitorRouter.route('/group', groupRouter);
monitorRouter.route('/port-group', portGroupRouter);
monitorRouter.route('/rule', ruleRouter);
monitorRouter.route('/status', statusRouter);

export default monitorRouter;
