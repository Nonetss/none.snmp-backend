import axios from 'axios';
import { db } from '@/core/config';

export async function getNpmProxyHosts() {
  const npmAuths = await db.query.npmAuthTable.findMany();

  if (npmAuths.length === 0) {
    return {
      response: [],
      metadata: {
        exists: false,
        total: 0,
      },
    };
  }

  const results = await Promise.all(
    npmAuths.map(async (auth) => {
      const { url, username, password } = auth;
      try {
        // 1. Authenticate to get token
        const authResponse = await axios.post(`${url}/api/tokens`, {
          identity: username,
          secret: password,
        });

        const token = authResponse.data.token;

        if (!token) {
          return null;
        }

        // 2. Get Proxy Hosts using the token
        const hostsResponse = await axios.get(`${url}/api/nginx/proxy-hosts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return {
          url: url,
          resource: hostsResponse.data,
        };
      } catch (error) {
        console.error(`Error fetching NPM proxy hosts for ${url}:`, error);
        return null;
      }
    }),
  );

  const response = results.filter((r) => r !== null) as {
    url: string;
    resource: any;
  }[];

  const metadata = {
    exists: response.length > 0,
    total_org: response.length,
  };

  return { response, metadata };
}
