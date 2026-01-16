import { Handler } from 'hono';
import { getNpmProxyHosts } from '@/lib/proxy/npm';
import { getPangolinProxyResources } from '@/lib/proxy/pangolin';

export const bothGetHandler: Handler = async (c) => {
  try {
    const npmResult = await getNpmProxyHosts();
    const pangolinResult = await getPangolinProxyResources();

    if (npmResult.response.length === 0 && !npmResult.metadata.exists) {
      return c.json({ error: 'NPM credentials not found in database' }, 404);
    }
    if (
      pangolinResult.response.length === 0 &&
      !pangolinResult.metadata.exists
    ) {
      return c.json(
        { error: 'Pangolin credentials not found in database' },
        404,
      );
    }

    return c.json({ npm: npmResult, pangolin: pangolinResult });
  } catch (error: any) {
    console.error('Error in NPM handler:', error.message);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
};
