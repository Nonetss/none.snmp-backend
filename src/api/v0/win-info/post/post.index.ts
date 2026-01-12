import { OpenAPIHono } from '@hono/zod-openapi';
import { postHandler } from './post.handler';
import { postRoute } from './post.route';

const WinInfoPostApi = new OpenAPIHono();

WinInfoPostApi.openapi(postRoute, postHandler);

export default WinInfoPostApi;
