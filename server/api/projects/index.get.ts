// Lists all projects for a given team.

import { createPocketBaseInstance } from '~/utils/helpers/pocketbase';
import { requireAuth, isTeamMember } from '~/utils/helpers/auth';
import type { IProject } from '~/utils/models';

export default defineEventHandler(async (event): Promise<IProject[] | { error: string }> => {
  const user = requireAuth(event);

  const { teamId } = getQuery(event);
  if (!teamId || typeof teamId !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team ID is required.',
    });
  }

  if (!isTeamMember(user, teamId)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    });
  }

  const pb = await createPocketBaseInstance(event);

  const projects = await pb.collection('projects').getFullList({
    filter: `team.id = "${teamId}"`,
    sort: '-created',
    expand: 'team, owner',
  });

  const formattedProjects: IProject[] = projects.map(project => ({
    ...project,
    name: project.name,
    team: project.expand?.team,
    owner: project.expand?.owner,
    members: project.members || [],
  }));

  return formattedProjects;
});
