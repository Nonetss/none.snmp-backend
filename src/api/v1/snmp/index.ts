import { OpenAPIHono } from '@hono/zod-openapi';
import authRouter from './auth';
import scanRouter from './scan';

const snmpRouter = new OpenAPIHono();

snmpRouter.route('/auth', authRouter);
snmpRouter.route('/scan', scanRouter);

export default snmpRouter;
