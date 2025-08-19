// Creates a new project for a team.

import { z } from 'zod';
import { createPocketBaseInstance } from '~/utils/helpers/pocketbase';
import { requireAuth } from '~/utils/helpers/auth';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required.'),
  description: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const user = requireAuth(event);

  const team = user.teams[0];

  if (!team) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    });
  }

  if (team.subscription?.status !== 'active') {
    throw createError({
      statusCode: 402,
      statusMessage: 'Team subscription is not active.',
    });
  }

  const body = await readBody(event);
  const { name, description } = createProjectSchema.parse(body);

  const pb = await createPocketBaseInstance(event);

  const projects = await pb.collection('projects').getFullList({
    filter: `team.id = "${team.id}"`,
    sort: '-created',
  });

  if (team.subscription?.plan.max_projects != -1 && team.subscription?.plan.max_projects <= projects.length) {
    throw createError({
      statusCode: 402,
      statusMessage: 'Max projects limit reached.',
    });
  }

  const newProject = await pb.collection('projects').create({
    name,
    description,
    members: [user.id],
    owner: user.id,
    team: team.id,
  });

  return newProject;
});
