import { OpenAPIHono } from '@hono/zod-openapi';
import { postPollLldpRoute, postPollSingleLldpRoute } from './post.route';
import { postPollLldpHandler, postPollSingleLldpHandler } from './post.handler';

const pollLldpRouter = new OpenAPIHono();

pollLldpRouter.openapi(postPollLldpRoute, postPollLldpHandler);
pollLldpRouter.openapi(postPollSingleLldpRoute, postPollSingleLldpHandler);

export default pollLldpRouter;
