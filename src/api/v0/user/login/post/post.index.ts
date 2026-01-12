import { OpenAPIHono } from '@hono/zod-openapi';
import { postLoginHandler } from './post.handler';
import { postLoginRoute } from './post.route';

const UserLoginPostApi = new OpenAPIHono();

UserLoginPostApi.openapi(postLoginRoute, postLoginHandler);

export default UserLoginPostApi;
