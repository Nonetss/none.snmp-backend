import { OpenAPIHono } from '@hono/zod-openapi';
import snmpRouter from '@/api/v0/snmp';
import searchRouter from '@/api/v0/search';
import locationRouter from '@/api/v0/location';
import tagRouter from '@/api/v0/tag';
import monitorRouter from '@/api/v0/monitor';
import notificationsRouter from '@/api/v0/notifications';
import winInfoRouter from '@/api/v0/win-info';
import userRouter from '@/api/v0/user';
import proxyRouter from '@/api/v0/proxy';
import toolboxRouter from '@/api/v0/toolbox';
import komodoRouter from '@/api/v0/komodo';

const apiRouter = new OpenAPIHono();

apiRouter.route('/v0/snmp', snmpRouter);
apiRouter.route('/v0/search', searchRouter);
apiRouter.route('/v0/location', locationRouter);
apiRouter.route('/v0/tag', tagRouter);
apiRouter.route('/v0/monitor', monitorRouter);
apiRouter.route('/v0/notifications', notificationsRouter);
apiRouter.route('/v0/win-info', winInfoRouter);
apiRouter.route('/v0/user', userRouter);
apiRouter.route('/v0/proxy', proxyRouter);
apiRouter.route('/v0/toolbox', toolboxRouter);
apiRouter.route('/v0/komodo', komodoRouter);

export default apiRouter;
