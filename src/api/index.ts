import { OpenAPIHono } from '@hono/zod-openapi';
import snmpRouter from '@/api/v1/snmp';
import searchRouter from '@/api/v1/search';

const apiRouter = new OpenAPIHono();

apiRouter.route('/v1/snmp', snmpRouter);
apiRouter.route('/v1/search', searchRouter);

export default apiRouter;
