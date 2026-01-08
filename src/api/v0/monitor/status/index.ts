import { OpenAPIHono } from '@hono/zod-openapi';
import listStatusRouter from './list/list.index';
import getRuleStatusRouter from './get/get.index';

const status = new OpenAPIHono();

status.route('/', listStatusRouter);
status.route('/', getRuleStatusRouter);

export default status;
