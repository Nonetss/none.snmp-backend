import { OpenAPIHono } from '@hono/zod-openapi';
import snmpRouter from '@/api/v0/snmp';
import searchRouter from '@/api/v0/search';
import locationRouter from '@/api/v0/location';
import tagRouter from '@/api/v0/tag';

const apiRouter = new OpenAPIHono();

apiRouter.route('/v0/snmp', snmpRouter);
apiRouter.route('/v0/search', searchRouter);
apiRouter.route('/v0/location', locationRouter);
apiRouter.route('/v0/tag', tagRouter);

export default apiRouter;
