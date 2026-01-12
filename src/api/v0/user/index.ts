import { OpenAPIHono } from '@hono/zod-openapi';
import loginRouter from './login/index';
import listRouter from './list/get.index';
import lastLoginRouter from './last-login/get.index';
import computersRouter from './computers/get.index';

const userRouter = new OpenAPIHono();

userRouter.route('/login', loginRouter);
userRouter.route('/list', listRouter);
userRouter.route('/last-login', lastLoginRouter);
userRouter.route('/computers', computersRouter);

export default userRouter;
