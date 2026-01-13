import { Handler } from 'hono';
import { getNpmProxyHosts } from '@/lib/proxy/npm';

export const npmGetHandler: Handler = async (c) => {
  try {
    const hosts = await getNpmProxyHosts();
    return c.json(hosts);
  } catch (error: any) {
    console.error('Error in NPM handler:', error.message);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
};
