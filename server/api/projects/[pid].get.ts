// Gets a project by its ID.


import type { IProject } from '~/utils/models';
import { isTeamMember, requireAuth } from '~/utils/helpers/auth';
import { createPocketBaseInstance } from '~/utils/helpers/pocketbase';

export default defineEventHandler(async (event): Promise<IProject | { error: string }> => {
  const user = requireAuth(event);

  const pid = event.context.params?.pid;
  if (!pid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project ID is required.',
    });
  }

  const pb = await createPocketBaseInstance(event);

  const project = await pb.collection('projects').getOne(pid);
  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project not found.',
    });
  }

  if (!isTeamMember(user, project.team)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    });
  }

  const formattedProject: IProject = {
    ...project,
    name: project.name,
    team: project.team,
    owner: project.owner,
    members: project.members || [],
  };

  return formattedProject;
}); 