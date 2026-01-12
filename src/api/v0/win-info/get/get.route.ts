import { createRoute } from '@hono/zod-openapi';
import { getWinInfoQuerySchema, getWinInfoResponseSchema } from './get.schema';

export const getWinInfoRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['WinInfo'],
  summary: 'Get detailed system info',
  description:
    'Retrieve detailed system information for a specific computer by name or IP. Returns the latest data by default or for a specific date if provided. Available tables: BIOS, BaseBoard, ComputerSystemProduct, DiskDrive, InstalledApplications, NetworkIdentity, NetworkAdapterConfig, OperatingSystem, PhysicalMemory, Processor, RunningServices.',
  request: {
    query: getWinInfoQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getWinInfoResponseSchema,
        },
      },
      description: 'Detailed system information retrieved',
    },
    404: {
      description: 'Computer or data for the specified date not found',
    },
  },
});
