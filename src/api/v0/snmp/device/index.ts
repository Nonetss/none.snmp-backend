import { OpenAPIHono } from '@hono/zod-openapi';
import deleteRouter from '@/api/v0/snmp/device/delete/delete.index';

const deviceRouter = new OpenAPIHono();

deviceRouter.route('/', deleteRouter);

export default deviceRouter;
