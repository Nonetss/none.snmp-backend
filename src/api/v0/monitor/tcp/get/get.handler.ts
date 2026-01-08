import { checkTcpPort } from '@/lib/tcp';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getTcpCheckRoute } from './get.route';

export const getTcpCheckHandler: RouteHandler<typeof getTcpCheckRoute> = async (
  c,
) => {
  try {
    const { ip, port, timeout } = c.req.valid('query');

    const portNum = parseInt(port, 10);
    const timeoutNum = timeout ? parseInt(timeout, 10) : 2000;

    const result = await checkTcpPort(ip, portNum, timeoutNum);

    return c.json(
      {
        ...result,
        ip,
        port: portNum,
      },
      200,
    );
  } catch (error) {
    console.error('[TCP Check] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
