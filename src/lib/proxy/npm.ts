import axios from 'axios';
import { db } from '@/core/config';
import { npmAuthTable } from '@/db';

export async function getNpmProxyHosts() {
  const [auth] = await db.select().from(npmAuthTable).limit(1);

  if (!auth) {
    console.error('NPM credentials not found in database');
    return [];
  }

  const { url, username, password } = auth;

  try {
    // 1. Authenticate to get token
    const authResponse = await axios.post(`${url}/api/tokens`, {
      identity: username,
      secret: password,
    });

    const token = authResponse.data.token;

    if (!token) {
      return [];
    }

    // 2. Get Proxy Hosts using the token
    const hostsResponse = await axios.get(`${url}/api/nginx/proxy-hosts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return hostsResponse.data;
  } catch (error) {
    console.error('Error fetching NPM proxy hosts:', error);
    return [];
  }
}
