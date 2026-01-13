import { createRoute } from '@hono/zod-openapi';
import {
  getTracerouteRequestSchema,
  getTracerouteResponseSchema,
} from './get.schema';

export const getTracerouteRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Perform a traceroute to a host',
  tags: ['Toolbox'],
  request: {
    query: getTracerouteRequestSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getTracerouteResponseSchema,
        },
      },
      description: 'Traceroute result',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
