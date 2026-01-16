import { Handler } from 'hono';
import axios from 'axios';
import { db } from '@/core/config';

export async function getPangolinProxyResources() {
  const pangolinAuth = await db.query.pangolinAuthTable.findMany({
    with: {
      pangolinOrg: true,
    },
  });

  if (pangolinAuth.length === 0) {
    return {
      response: [],
      metadata: {
        exists: false,
        total_org: 0,
      },
    };
  }

  interface Resource {
    url: string;
    org: string;
    resource: any[];
  }

  const response: Resource[] = [];

  for (const auth of pangolinAuth) {
    const { url, token } = auth;
    const pangolin = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resourcesPromises = auth.pangolinOrg.map(async (org) => {
      const response = await pangolin.get(`/v1/org/${org.slug}/resources`);
      return {
        url: auth.url,
        org: org.slug,
        resource: response.data.data.resources,
      };
    });

    response.push(...(await Promise.all(resourcesPromises)));
  }

  return {
    response,
    metadata: {
      exists: response.length > 0,
      total_org: response.length,
    },
  };
}
