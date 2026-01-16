import { Handler } from 'hono';
import axios from 'axios';
import { db } from '@/core/config';
import { getPangolinProxyResources } from '@/lib/proxy/pangolin';

export const pangolinGetHandler: Handler = async (c) => {
  const pangolinResult = await getPangolinProxyResources();

  if (pangolinResult.response.length === 0 && !pangolinResult.metadata.exists) {
    return c.json({ error: 'Pangolin credentials not found in database' }, 404);
  }

  return c.json(pangolinResult);
};
