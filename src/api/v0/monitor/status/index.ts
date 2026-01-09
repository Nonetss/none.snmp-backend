import { OpenAPIHono } from '@hono/zod-openapi';
import { listPortStatusRoute } from './list/list.route';
import { listPortStatusHandler } from './list/list.handler';
import { getRuleStatusRoute } from './get/get.route';
import { getRuleStatusHandler } from './get/get.handler';

const status = new OpenAPIHono();

status.openapi(listPortStatusRoute, listPortStatusHandler);
status.openapi(getRuleStatusRoute, getRuleStatusHandler);

export default status;
