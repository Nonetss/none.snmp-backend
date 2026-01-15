import { Handler } from 'hono';
import { getNpmProxyHosts } from '@/lib/proxy/npm';

export const npmGetHandler: Handler = async (c) => {
  try {
    const result = await getNpmProxyHosts();

    if (result.response.length === 0 && !result.metadata.exists) {
      return c.json({ error: 'NPM credentials not found in database' }, 404);
    }

    return c.json(result);
  } catch (error: any) {
    console.error('Error in NPM handler:', error.message);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
};
