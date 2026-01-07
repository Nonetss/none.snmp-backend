import { createRoute, z } from '@hono/zod-openapi';
import {
  connectionSearchResponseSchema,
  connectionSearchSchema,
} from './get.schema';

export const getConnectionSearchRoute = createRoute({
  method: 'get',
  path: '/connection',
  summary: 'Search connection by IP or MAC',
  tags: ['Search', 'Search Connection'],
  description:
    'Searches the ARP/Neighbor tables to find which device and port a specific IP or MAC is connected to.',
  request: {
    query: connectionSearchSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: connectionSearchResponseSchema,
        },
      },
      description: 'Search results',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
