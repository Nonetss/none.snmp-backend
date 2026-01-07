import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from '@/api/v0/snmp/scan/post/post.index';
import rescanRouter from '@/api/v0/snmp/scan/rescan/rescan.index';
import allRouter from '@/api/v0/snmp/scan/all/all.index';

const scanRouter = new OpenAPIHono();

scanRouter.route('/', allRouter);
scanRouter.route('/', rescanRouter);
scanRouter.route('/', postRouter);

export default scanRouter;
