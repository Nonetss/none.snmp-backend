import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from './post/post.index';
import getRouter from './get/get.index';
import listRouter from './list/get.index';
import applicationsRouter from './applications/get.index';
import applicationsListRouter from './applications/list/get.index';
import byApplicationRouter from './by-application/get.index';
import byServiceRouter from './by-service/get.index';
import modelsRouter from './models/get.index';
import ramRouter from './ram/get.index';
import servicesRouter from './services/get.index';
import servicesListRouter from './services/list/get.index';
import storageRouter from './storage/get.index';

const winInfoRouter = new OpenAPIHono();

winInfoRouter.route('/', postRouter);
winInfoRouter.route('/', getRouter);
winInfoRouter.route('/', listRouter);
winInfoRouter.route('/', applicationsRouter);
winInfoRouter.route('/', applicationsListRouter);
winInfoRouter.route('/', byApplicationRouter);
winInfoRouter.route('/', byServiceRouter);
winInfoRouter.route('/', modelsRouter);
winInfoRouter.route('/', ramRouter);
winInfoRouter.route('/', servicesRouter);
winInfoRouter.route('/', servicesListRouter);
winInfoRouter.route('/', storageRouter);

export default winInfoRouter;
