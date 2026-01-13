import axios from 'axios';
const NPM_URL = process.env.NPM_URL;
const NPM_IDENTITY = process.env.NPM_IDENTITY;
const NPM_SECRET = process.env.NPM_SECRET;

export async function getNpmProxyHosts() {
  if (!NPM_URL || !NPM_IDENTITY || !NPM_SECRET) {
    return [];
  }

  try {
    // 1. Authenticate to get token
    const authResponse = await axios.post(`${NPM_URL}/api/tokens`, {
      identity: NPM_IDENTITY,
      secret: NPM_SECRET,
    });

    const token = authResponse.data.token;

    if (!token) {
      return [];
    }

    // 2. Get Proxy Hosts using the token
    const hostsResponse = await axios.get(`${NPM_URL}/api/nginx/proxy-hosts`, {
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
