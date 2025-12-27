import { OpenAPIHono } from '@hono/zod-openapi';
import authRouter from './auth';

const snmpRouter = new OpenAPIHono();

snmpRouter.route('/auth', authRouter);

export default snmpRouter;
