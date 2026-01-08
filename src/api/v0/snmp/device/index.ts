import { OpenAPIHono } from '@hono/zod-openapi';
import deleteRouter from '@/api/v0/snmp/device/delete/delete.index';
import pollRouter from '@/api/v0/snmp/device/poll/poll.index';

const deviceRouter = new OpenAPIHono();

deviceRouter.route('/', deleteRouter);
deviceRouter.route('/', pollRouter);

export default deviceRouter;
