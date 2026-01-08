import { createRoute } from '@hono/zod-openapi';
import {
  AssignTagsSchema,
  TagAssignmentResponseSchema,
  UnassignTagsSchema,
} from './assign.schema';

export const postAssignTagsRoute = createRoute({
  method: 'post',
  path: '/assign',
  summary: 'Assign multiple tags to multiple devices',
  tags: ['Tag'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: AssignTagsSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: TagAssignmentResponseSchema,
        },
      },
      description: 'Tags assigned successfully',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});

export const postUnassignTagsRoute = createRoute({
  method: 'post',
  path: '/unassign',
  summary: 'Unassign multiple tags from multiple devices',
  tags: ['Tag'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UnassignTagsSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: TagAssignmentResponseSchema,
        },
      },
      description: 'Tags unassigned successfully',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
