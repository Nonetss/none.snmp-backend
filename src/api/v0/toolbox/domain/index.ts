import { OpenAPIHono } from '@hono/zod-openapi';
import listDomainRouter from './list';
import getDomainRouter from './get';
import postDomainRouter from './post';
import patchDomainRouter from './patch';
import deleteDomainRouter from './delete';

const domainRouter = new OpenAPIHono();

domainRouter.route('/', listDomainRouter);
domainRouter.route('/', getDomainRouter);
domainRouter.route('/', postDomainRouter);
domainRouter.route('/', patchDomainRouter);
domainRouter.route('/', deleteDomainRouter);

export default domainRouter;
