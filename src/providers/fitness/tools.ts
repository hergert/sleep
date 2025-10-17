import {
  CallToolRequestSchema,
  CompleteRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import type {
  CallToolRequest,
  CallToolResult,
  ListPromptsResult,
  ListResourcesResult,
} from '@modelcontextprotocol/sdk/types.js';
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';

import { ensureAuthenticated, withFitnessClient } from './context.js';
import { createLogger } from '../../platform/logging/logger.js';

const logger = createLogger('fitness-tools');

const registerToolsList = (server: Server) => {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'fitness_get_user_profile',
        title: 'Get Workout User Profile',
        description: 'Retrieve the authenticated user\'s workout profile (powered by Tonal).',
        inputSchema: {
          type: 'object',
          additionalProperties: false,
        },
        outputSchema: {
          type: 'object',
          additionalProperties: true,
        },
      },
      {
        name: 'fitness_list_sessions',
        title: 'List Completed Workout Sessions',
        description: 'Retrieve the user\'s completed workout session history from Tonal. Returns actual workout sessions that were performed, including timestamp (when the workout was completed), duration, reps, volume, calories burned, and workout details. Most recent workouts first. Use this to answer questions like "what workouts did I do this week/month" or "show my recent training". Supports pagination via offset/limit.',
        inputSchema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            offset: { type: 'number', minimum: 0, default: 0 },
            limit: { type: 'number', minimum: 1, maximum: 50, default: 20 },
          },
        },
        outputSchema: {
          type: 'object',
          required: ['sessions'],
          additionalProperties: true,
          properties: {
            sessions: {
              type: 'array',
              description: 'Array of completed workout sessions, sorted by most recent first',
              items: {
                type: 'object',
                additionalProperties: true,
                description: 'Completed workout session with timestamp, name, duration, reps, volume, calories, and completion details'
              },
            },
          },
        },
      },
      {
        name: 'fitness_list_workouts',
        title: 'List Workouts Catalog',
        description: 'Retrieve the general Tonal workout library catalog. Returns all available workouts that refresh and grow over time. Includes Tonal programs, workout routines, exercise lists, target areas, duration, and difficulty levels. Supports pagination via offset/limit.',
        inputSchema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            offset: { type: 'number', minimum: 0, default: 0 },
            limit: { type: 'number', minimum: 1, maximum: 50, default: 20 },
          },
        },
        outputSchema: {
          type: 'object',
          required: ['workouts'],
          additionalProperties: true,
          properties: {
            workouts: {
              type: 'array',
              description: 'Array of workouts from the Tonal catalog',
              items: {
                type: 'object',
                additionalProperties: true,
                description: 'Workout with title, exercises, target areas, duration, and difficulty level'
              },
            },
          },
        },
      },
      {
        name: 'fitness_list_user_workouts',
        title: 'List User Custom Workouts',
        description: 'Retrieve the user\'s custom workouts. Returns workouts that the user has created, saved, or bookmarked. Includes exercise lists, target areas, duration, and workout structure. Use this to answer questions like "what workouts do I have saved?" or "show my custom workouts". Supports pagination via offset/limit.',
        inputSchema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            offset: { type: 'number', minimum: 0, default: 0 },
            limit: { type: 'number', minimum: 1, maximum: 50, default: 20 },
          },
        },
        outputSchema: {
          type: 'object',
          required: ['workouts'],
          additionalProperties: true,
          properties: {
            workouts: {
              type: 'array',
              description: 'Array of user\'s custom workouts',
              items: {
                type: 'object',
                additionalProperties: true,
                description: 'User custom workout with title, exercises, target areas, duration, and difficulty level'
              },
            },
          },
        },
      },
      {
        name: 'fitness_list_movements',
        title: 'List Workout Movements',
        description: 'Retrieve the catalogue of Tonal movements/exercises.',
        inputSchema: {
          type: 'object',
          additionalProperties: false,
        },
        outputSchema: {
          type: 'object',
          required: ['movements'],
          additionalProperties: true,
          properties: {
            movements: {
              type: 'array',
              items: { type: 'object', additionalProperties: true },
            },
          },
        },
      },
      {
        name: 'fitness_create_session',
        title: 'Create Workout Session',
        description: 'Create a custom Tonal workout using the provided workout payload.',
        inputSchema: {
          type: 'object',
          additionalProperties: false,
          required: ['workout'],
          properties: {
            workout: {
              type: 'object',
              description: 'Workout payload matching Tonal API (title, sets, etc.).',
              additionalProperties: true,
            },
          },
        },
        outputSchema: {
          type: 'object',
          additionalProperties: true,
        },
      },
    ],
  }));
};

const registerCallTool = (server: Server) => {
  server.setRequestHandler(
    CallToolRequestSchema,
    async ({ params }: CallToolRequest, extra): Promise<CallToolResult> => {
      const { name, arguments: rawArgs = {} } = params;

      try {
        switch (name) {
          case 'fitness_get_user_profile': {
            return await withFitnessClient(extra, async ({ client }) => {
              try {
                const profile = await client.getUserProfile();
                return {
                  content: [
                    {
                      type: 'text',
                      text: JSON.stringify(profile, null, 2),
                      annotations: { audience: ['assistant'] },
                    },
                  ],
                  structuredContent: profile as unknown as Record<string, unknown>,
                };
              } catch (error) {
                logger.error('get_user_profile failed', undefined, error);
                throw error;
              }
            });
          }

          case 'fitness_list_sessions': {
            const { offset = 0, limit = 20 } = rawArgs as { offset?: number; limit?: number };
            return await withFitnessClient(extra, async ({ client }) => {
              try {
                const workouts = await client.getWorkoutHistories(offset, limit);
                return {
                  content: [
                    {
                      type: 'text',
                      text: JSON.stringify(workouts, null, 2),
                      annotations: { audience: ['assistant'] },
                    },
                  ],
                  structuredContent: { sessions: workouts } as unknown as Record<string, unknown>,
                };
              } catch (error) {
                logger.error('list_sessions failed', undefined, error);
                throw error;
              }
            });
          }

          case 'fitness_list_movements': {
            return await withFitnessClient(extra, async ({ client }) => {
              try {
                const movements = await client.getMovements();
                return {
                  content: [
                    {
                      type: 'text',
                      text: JSON.stringify(movements, null, 2),
                      annotations: { audience: ['assistant'] },
                    },
                  ],
                  structuredContent: { movements } as unknown as Record<string, unknown>,
                };
              } catch (error) {
                logger.error('list_movements failed', undefined, error);
                throw error;
              }
            });
          }

          case 'fitness_list_workouts': {
            const { offset = 0, limit = 20 } = rawArgs as { offset?: number; limit?: number };
            return await withFitnessClient(extra, async ({ client }) => {
              try {
                const workouts = await client.getWorkouts(offset, limit);
                return {
                  content: [
                    {
                      type: 'text',
                      text: JSON.stringify(workouts, null, 2),
                      annotations: { audience: ['assistant'] },
                    },
                  ],
                  structuredContent: { workouts } as unknown as Record<string, unknown>,
                };
              } catch (error) {
                logger.error('list_workouts failed', undefined, error);
                throw error;
              }
            });
          }

          case 'fitness_list_user_workouts': {
            const { offset = 0, limit = 20 } = rawArgs as { offset?: number; limit?: number };
            return await withFitnessClient(extra, async ({ client }) => {
              try {
                const workouts = await client.getUserWorkouts(offset, limit);
                return {
                  content: [
                    {
                      type: 'text',
                      text: JSON.stringify(workouts, null, 2),
                      annotations: { audience: ['assistant'] },
                    },
                  ],
                  structuredContent: { workouts } as unknown as Record<string, unknown>,
                };
              } catch (error) {
                logger.error('list_user_workouts failed', undefined, error);
                throw error;
              }
            });
          }

          case 'fitness_create_session': {
            const { workout } = rawArgs as { workout: unknown };
            if (typeof workout !== 'object' || workout === null) {
              const error = new Error('Argument "workout" must be a JSON object describing the workout.');
              (error as Error & { code?: number }).code = -32602;
              throw error;
            }

            return await withFitnessClient(extra, async ({ client }) => {
              try {
                const created = await client.createWorkout(workout);
                return {
                  content: [
                    {
                      type: 'text',
                      text: JSON.stringify(created, null, 2),
                      annotations: { audience: ['assistant'] },
                    },
                  ],
                  structuredContent: created as unknown as Record<string, unknown>,
                };
              } catch (error) {
                logger.error('create_session failed', undefined, error);
                throw error;
              }
            });
          }

          default:
            return {
              content: [{ type: 'text', text: `Unknown tool: ${name}` }],
              isError: true,
            };
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Tool ${name} failed: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
};

const registerResources = (server: Server) => {
  server.setRequestHandler(
    ListResourcesRequestSchema,
    async (_request, extra): Promise<ListResourcesResult> => {
      ensureAuthenticated(extra);
      return {
        resources: [
          {
            uri: 'fitness://user/profile',
            name: 'fitness-profile',
            title: 'Workout User Profile',
            description: 'Cached Tonal user profile snapshot.',
            mimeType: 'application/json',
            annotations: {
              audience: ['assistant'],
              priority: 0.8,
              lastModified: new Date().toISOString(),
            },
          },
        ],
        resourceTemplates: [
          {
            uriTemplate: 'fitness://sessions/{offset}/{limit}',
            name: 'fitness-sessions-range',
            title: 'Workout Sessions Range',
            description: 'Fetch a paginated page of workout sessions. Offset and limit mirror API headers.',
            mimeType: 'application/json',
            annotations: {
              audience: ['assistant'],
              priority: 0.7,
            },
          },
        ],
      };
    }
  );

  server.setRequestHandler(ReadResourceRequestSchema, async ({ params }, extra) => {
    const { uri } = params;

    if (uri === 'fitness://user/profile') {
      return withFitnessClient(extra, async ({ client }) => {
        const profile = await client.getUserProfile();
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(profile),
            },
          ],
        };
      });
    }

    const rangeMatch = uri.match(/^fitness:\/\/sessions\/(\d+)\/(\d+)$/);
    if (rangeMatch) {
      const offset = Number.parseInt(rangeMatch[1], 10);
      const limit = Number.parseInt(rangeMatch[2], 10);
      return withFitnessClient(extra, async ({ client }) => {
        const workouts = await client.getWorkoutHistories(offset, limit);
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(workouts),
            },
          ],
        };
      });
    }

    const error = new Error(`Unknown resource URI: ${uri}`);
    (error as Error & { code?: number }).code = -32602;
    throw error;
  });
};

const registerPrompts = (server: Server) => {
  server.setRequestHandler(
    ListPromptsRequestSchema,
    async (_request, extra): Promise<ListPromptsResult> => {
      ensureAuthenticated(extra);
      return {
        prompts: [
          {
            name: 'workout_analyze_sessions',
            title: 'Analyze Workout Sessions',
            description: 'Guide the assistant to summarize recent Tonal workouts and suggest next steps.',
            arguments: [
              {
                name: 'limit',
                description: 'Number of recent workouts to review (default 5).',
                required: false,
                default: 5,
              },
            ],
          },
        ],
      };
    }
  );

  server.setRequestHandler(GetPromptRequestSchema, async ({ params }, extra) => {
    if (params.name !== 'workout_analyze_sessions') {
      const error = new Error(`Unknown prompt: ${params.name}`);
      (error as Error & { code?: number }).code = -32602;
      throw error;
    }

    ensureAuthenticated(extra);
    const limitArg = params.arguments?.limit;
    const limit = Math.max(1, Math.min(20, typeof limitArg === 'number' ? Math.floor(limitArg) : 5));

    return {
      description: 'Analyze recent Tonal workouts and recommend the next training focus.',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Review my last ${limit} Tonal workouts. Summarize key movements, volume trends, and suggest the next workout focus.`,
            annotations: { audience: ['assistant'], priority: 1.0 },
          },
        },
        {
          role: 'assistant',
          content: {
            type: 'text',
            text: 'Sure—load the latest workouts using the `fitness_list_sessions` tool or the `fitness://sessions/{offset}/{limit}` resource, highlight major patterns, and propose actionable next steps.',
            annotations: { audience: ['user'], priority: 0.6 },
          },
        },
      ],
    };
  });

  server.setRequestHandler(CompleteRequestSchema, async ({ params }, extra) => {
    if (params.ref.type === 'ref/prompt' && params.ref.name === 'workout_analyze_sessions') {
      if (params.argument.name !== 'limit') {
        return { completion: { values: [], total: 0 } };
      }
      ensureAuthenticated(extra);

      const seedOptions = ['3', '5', '7', '10', '15', '20'];
      const query = params.argument.value?.toString() ?? '';
      const values = seedOptions.filter((option) => option.startsWith(query.replace(/^\s+/, '')));

      return {
        completion: {
          values,
          total: values.length,
        },
      };
    }

    if (params.ref.type === 'ref/resource') {
      ensureAuthenticated(extra);

      const workoutsTemplate = params.ref.uri?.match(/^fitness:\/\/sessions\/\{offset\}\/\{limit\}$/);
      if (workoutsTemplate) {
        const query = params.argument.value?.toString() ?? '';
        const values: string[] = [];
        if (params.argument.name === 'offset') {
          for (let i = 0; i < 4; i++) {
            values.push(String(i * 20));
          }
        } else if (params.argument.name === 'limit') {
          ['10', '20', '30', '40', '50'].forEach((value) => values.push(value));
        }
        const filtered = values.filter((value) => value.startsWith(query));
        return {
          completion: {
            values: filtered,
            total: filtered.length,
          },
        };
      }
    }

    return { completion: { values: [], total: 0 } };
  });
};

export const registerFitnessHandlers = (server: Server) => {
  registerToolsList(server);
  registerCallTool(server);
  registerResources(server);
  registerPrompts(server);
};
