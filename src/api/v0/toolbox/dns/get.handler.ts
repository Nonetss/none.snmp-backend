import type { RouteHandler } from '@hono/zod-openapi';
import type { getDnsRoute } from './get.route';
import { Resolver } from 'dns/promises';

export const getDnsHandler: RouteHandler<typeof getDnsRoute> = async (c) => {
  const { domain, server, type } = c.req.valid('query');

  try {
    const resolver = new Resolver();

    if (server) {
      resolver.setServers([server]);
    }

    let answers: any[] = [];

    try {
      switch (type) {
        case 'AAAA':
          answers = await resolver.resolve6(domain);
          break;
        case 'MX':
          answers = await resolver.resolveMx(domain);
          break;
        case 'TXT':
          answers = await resolver.resolveTxt(domain);
          break;
        case 'NS':
          answers = await resolver.resolveNs(domain);
          break;
        case 'CNAME':
          answers = await resolver.resolveCname(domain);
          break;
        case 'SOA':
          answers = [await resolver.resolveSoa(domain)];
          break;
        case 'PTR':
          answers = await resolver.resolvePtr(domain);
          break;
        case 'A':
        default:
          answers = await resolver.resolve4(domain);
          break;
      }
    } catch (dnsErr: any) {
      if (dnsErr.code === 'ENODATA' || dnsErr.code === 'ENOTFOUND') {
        answers = [];
      } else {
        throw dnsErr;
      }
    }

    return c.json(
      {
        domain,
        server: server || null,
        type,
        answers,
      },
      200,
    );
  } catch (error: any) {
    console.error(`[DNS Toolbox] Error resolving ${domain}:`, error);
    return c.json(
      { message: error.message || 'Internal Server Error' },
      500,
    ) as any;
  }
};
