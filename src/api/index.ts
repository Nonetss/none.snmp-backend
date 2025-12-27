import { OpenAPIHono } from '@hono/zod-openapi';
import snmpRouter from './v1/snmp';

const apiRouter = new OpenAPIHono();

apiRouter.route('/v1/snmp', snmpRouter);

export default apiRouter;
