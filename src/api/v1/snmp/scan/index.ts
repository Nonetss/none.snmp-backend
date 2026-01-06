import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from '@/api/v1/snmp/scan/post/post.index';
import rescanRouter from '@/api/v1/snmp/scan/rescan/rescan.index';

const scanRouter = new OpenAPIHono();

scanRouter.route('/', postRouter);
scanRouter.route('/rescan', rescanRouter);

export default scanRouter;
