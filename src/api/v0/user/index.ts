import { OpenAPIHono } from '@hono/zod-openapi';
import loginRouter from './login/index';

const userRouter = new OpenAPIHono();

userRouter.route('/login', loginRouter);

export default userRouter;
