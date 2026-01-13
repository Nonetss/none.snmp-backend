import { OpenAPIHono } from '@hono/zod-openapi';
import { postDomainRoute } from './post.route';
import { postDomainHandler } from './post.handler';

const postDomainRouter = new OpenAPIHono();

postDomainRouter.openapi(postDomainRoute, postDomainHandler);

export default postDomainRouter;
