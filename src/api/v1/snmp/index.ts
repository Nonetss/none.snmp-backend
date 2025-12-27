import { OpenAPIHono } from '@hono/zod-openapi';
import authRouter from './auth';
import scanRouter from './scan';
import deviceRouter from './device';

const snmpRouter = new OpenAPIHono();

snmpRouter.route('/auth', authRouter);
snmpRouter.route('/scan', scanRouter);
snmpRouter.route('/device', deviceRouter);

export default snmpRouter;
