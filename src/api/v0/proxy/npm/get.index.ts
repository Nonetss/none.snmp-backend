import { OpenAPIHono } from '@hono/zod-openapi';
import { npmGetHandler } from './get.handler';
import { npmGetRoute } from './get.route';

const apiNpmGet = new OpenAPIHono();

apiNpmGet.openapi(npmGetRoute, npmGetHandler);

export default apiNpmGet;
