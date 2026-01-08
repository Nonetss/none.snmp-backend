import { OpenAPIHono } from '@hono/zod-openapi';
import { getRuleStatusRoute } from './get.route';
import { getRuleStatusHandler } from './get.handler';

const getRule = new OpenAPIHono();

getRule.openapi(getRuleStatusRoute, getRuleStatusHandler);

export default getRule;
