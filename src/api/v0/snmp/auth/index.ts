import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from '@/api/v0/snmp/auth/post/post.index';
import listRouter from '@/api/v0/snmp/auth/list/list.index';
import getRouter from '@/api/v0/snmp/auth/get/get.index';
import patchRouter from '@/api/v0/snmp/auth/patch/patch.index';
import deleteRouter from '@/api/v0/snmp/auth/delete/delete.index';

const authRouter = new OpenAPIHono();

authRouter.route('/', postRouter);
authRouter.route('/', listRouter);
authRouter.route('/', getRouter);
authRouter.route('/', patchRouter);
authRouter.route('/', deleteRouter);

export default authRouter;
